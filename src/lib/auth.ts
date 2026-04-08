import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getUserByEmail, getUserById, recordProfessionalLoginAttempt } from "@/lib/user-store";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        const user = await getUserByEmail(credentials.email);
        if (!user || !user.passwordHash) {
          return null;
        }

        if (user.role !== credentials.role) {
          return null;
        }

        if (user.role === "professional" && user.approvalStatus === "rejected") {
          await recordProfessionalLoginAttempt(user, "rejected");
          throw new Error("approval-rejected");
        }

        const isPasswordValid = await compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const dbUser = await getUserByEmail(user.email);
      if (!dbUser) {
        return "/login?error=register-first";
      }

      if (dbUser.role === "professional" && dbUser.approvalStatus === "rejected") {
        await recordProfessionalLoginAttempt(dbUser, "rejected");
        return "/login?error=approval-rejected";
      }

      user.id = dbUser.id;
      user.role = dbUser.role;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (token.id) {
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
      }

      return token;
    },
    async session({ session, token }) {
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
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
