import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getUserByEmail, getUserById, upsertGoogleUser, recordProfessionalLoginAttempt } from "@/lib/user-store";
import { markProfessionalLoggedIn } from "@/lib/professional-login-store";

const authSecret =
  process.env.NEXTAUTH_SECRET ||
  "lookit-fallback-secret-change-in-production-1234567890";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await getUserByEmail(credentials.email);
          if (!user || !user.passwordHash) {
            return null;
          }

          if (
            user.role === "professional" &&
            user.approvalStatus === "rejected"
          ) {
            await recordProfessionalLoginAttempt(user, "rejected");
            throw new Error("approval-rejected");
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          if (user.role === "professional") {
            await markProfessionalLoggedIn(user.id);
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret:
              process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "select_account",
              },
            },
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {

    // ✅ Google Login — auto-create account if not exists
    async signIn({ user, account }: any) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      try {
        let dbUser = await getUserByEmail(user.email);

        // 🟢 New Google user — auto-register as student
        if (!dbUser) {
          dbUser = await upsertGoogleUser({
            email: user.email,
            name: user.name || user.email.split("@")[0],
            image: user.image ?? null,
          });
        }

        if (
          dbUser.role === "professional" &&
          dbUser.approvalStatus === "rejected"
        ) {
          await recordProfessionalLoginAttempt(dbUser, "rejected");
          return "/login?error=approval-rejected";
        }

        user.id = dbUser.id;
        user.role = dbUser.role;

        if (dbUser.role === "professional") {
          await markProfessionalLoggedIn(dbUser.id);
        }

        return true;
      } catch (error) {
        console.error("Google SignIn Error:", error);
        return false;
      }
    },

    async jwt({ token, user }: any) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }

        if (token.id) {
          try {
            const dbUser = await getUserById(token.id);

            if (dbUser) {
              token.role = dbUser.role;
              token.name = dbUser.name;
              token.email = dbUser.email;
              token.picture = dbUser.image ?? token.picture;
              token.location = dbUser.location;
              token.profileBoostedUntil = dbUser.profileBoostedUntil;
              token.approvalStatus = dbUser.approvalStatus;
            }
          } catch (error) {
            console.error("JWT callback error fetching user:", error);
            // Return token without user data
          }
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }: any) {
      try {
        if (session.user) {
          session.user.id = token.id ?? "";
          session.user.role = token.role ?? "student";
          session.user.name = token.name ?? session.user.name;
          session.user.email = token.email ?? session.user.email;
          session.user.image = token.picture ?? session.user.image;
          session.user.location = token.location ?? "";
          session.user.profileBoostedUntil = token.profileBoostedUntil ?? null;
          session.user.approvalStatus = token.approvalStatus ?? "approved";
        }

        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },

  secret: authSecret,
  debug: process.env.NODE_ENV === "development",
};