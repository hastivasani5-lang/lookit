import Link from "next/link";
import { getServerSession } from "next-auth";
import { BookOpen, CalendarDays, ExternalLink, PlayCircle, ShoppingBag } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authOptions } from "@/lib/auth";
import { getStudentLibrary } from "@/lib/content-library-store";
import { getUserById } from "@/lib/user-store";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function EmptyState({ href, label, message }: { href: string; label: string; message: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
      {message}
      <div className="mt-4">
        <Link href={href} className="inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
          {label}
        </Link>
      </div>
    </div>
  );
}

export default async function StudentLibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#edf4f2] px-4 pb-14 pt-28 md:px-8 lg:px-10">
          <section className="mx-auto w-full max-w-5xl rounded-4xl border border-[#dbe8e4] bg-white p-6 shadow-[0_22px_45px_rgba(15,23,42,0.07)] md:p-8">
            <h1 className="text-3xl font-bold text-gray-900">Purchased Content</h1>
            <p className="mt-3 text-sm text-gray-600">Please sign in to view your purchased books and videos.</p>
            <Link href="/login" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              Go to Login
            </Link>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const user = await getUserById(session.user.id);

  if (!user || user.role !== "student") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#edf4f2] px-4 pb-14 pt-28 md:px-8 lg:px-10">
          <section className="mx-auto w-full max-w-5xl rounded-4xl border border-[#dbe8e4] bg-white p-6 shadow-[0_22px_45px_rgba(15,23,42,0.07)] md:p-8">
            <h1 className="text-3xl font-bold text-gray-900">Purchased Content</h1>
            <p className="mt-3 text-sm text-gray-600">This page is available for student accounts only.</p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const library = await getStudentLibrary(user.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#edf4f2] px-4 pb-14 pt-28 md:px-8 lg:px-10">
        <section className="mx-auto w-full max-w-6xl rounded-4xl border border-[#dbe8e4] bg-white p-6 shadow-[0_22px_45px_rgba(15,23,42,0.07)] md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Student Library</p>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Purchased Content</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                All the books and videos you have purchased are listed here, together with the purchase date and source.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f7fbfa] px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-500">Books Purchased</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{library.purchasedBooks.length}</p>
              </div>
              <div className="rounded-2xl bg-[#f7fbfa] px-4 py-3 shadow-sm">
                <p className="text-xs text-gray-500">Videos Purchased</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{library.watchedVideos.length}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Books</h2>
                <span className="text-sm text-gray-500">{library.purchasedBooks.length} item{library.purchasedBooks.length === 1 ? "" : "s"}</span>
              </div>

              {library.purchasedBooks.length === 0 ? (
                <EmptyState href="/shop" label="Browse Books" message="You have not purchased any books yet." />
              ) : (
                <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {library.purchasedBooks.map((book) => (
                    <article key={book.id} className="rounded-3xl border border-[#dbe8e4] bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Purchased Book</p>
                          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900">{book.title}</h3>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f8f2] px-3 py-1 text-xs font-semibold text-[#0f7a5c]">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Owned
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Source: {book.source}</p>
                        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Purchased: {formatDate(book.purchasedAt)}</p>
                        <p className="font-semibold text-primary">Amount: {book.amount}</p>
                      </div>

                      {book.accessUrl ? (
                        <div className="mt-5">
                          <Link
                            href={book.accessUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open Book
                          </Link>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Videos</h2>
                <span className="text-sm text-gray-500">{library.watchedVideos.length} item{library.watchedVideos.length === 1 ? "" : "s"}</span>
              </div>

              {library.watchedVideos.length === 0 ? (
                <EmptyState href="/shop" label="Browse Videos" message="You have not purchased any videos yet." />
              ) : (
                <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {library.watchedVideos.map((video) => (
                    <article key={video.id} className="rounded-3xl border border-[#dbe8e4] bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Purchased Video</p>
                          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900">{video.title}</h3>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2457c5]">
                          <PlayCircle className="h-3.5 w-3.5" />
                          Saved
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Provider: {video.provider}</p>
                        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Purchased: {formatDate(video.watchedAt)}</p>
                        <p className="font-semibold text-primary">Amount: {video.amount}</p>
                      </div>

                      {video.accessUrl ? (
                        <div className="mt-5">
                          <Link
                            href={video.accessUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open Video
                          </Link>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}