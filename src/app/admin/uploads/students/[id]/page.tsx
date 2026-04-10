import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { getUserById } from "@/lib/user-store";
import { getStudentLibrary } from "@/lib/content-library-store";

export default async function AdminStudentActivityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    redirect("/admin");
  }

  const { id } = await params;
  const user = await getUserById(id);

  if (!user || user.role !== "student") {
    notFound();
  }

  const library = await getStudentLibrary(id);

  return (
    <main className="min-h-screen bg-[#eef5f3] p-4 sm:p-6 font-sans">
      <section className="mx-auto w-full max-w-6xl space-y-5 rounded-3xl neumorph-admin-card bg-white sm:p-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Student Activity</h1>
            <p className="mt-1 text-sm text-slate-500">{user.name} • {user.email}</p>
          </div>
          <Link href="/admin" className="rounded-2xl bg-[#eef5f3] px-4 py-2 text-sm font-semibold text-[#2c5a48] shadow-[3px_3px_6px_#d0dbd6,-3px_-3px_6px_#ffffff] hover:shadow-inner transition-all">
            Back to Admin
          </Link>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Purchased Books</h2>
          {library.purchasedBooks.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No purchased books found.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 neumorph-admin-table">
                    <style>{`
                      .neumorph-admin-card {
                        background: #eef5f3;
                        box-shadow: 12px 12px 24px #d0dbd6, -12px -12px 24px #ffffff;
                        transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
                      }
                      .neumorph-admin-table {
                        background: #eef5f3;
                        box-shadow: 8px 8px 16px #d0dbd6, -8px -8px 16px #ffffff;
                      }
                    `}</style>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Purchased</th>
                  </tr>
                </thead>
                <tbody>
                  {library.purchasedBooks.map((book) => (
                    <tr key={book.id} className="border-t border-slate-100 text-slate-700">
                      <td className="px-4 py-3 font-medium text-slate-800">{book.title}</td>
                      <td className="px-4 py-3">{book.source}</td>
                      <td className="px-4 py-3">{book.amount}</td>
                      <td className="px-4 py-3">{book.purchasedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Watched Videos</h2>
          {library.watchedVideos.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No watched videos found.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Watched</th>
                  </tr>
                </thead>
                <tbody>
                  {library.watchedVideos.map((video) => (
                    <tr key={video.id} className="border-t border-slate-100 text-slate-700">
                      <td className="px-4 py-3 font-medium text-slate-800">{video.title}</td>
                      <td className="px-4 py-3">{video.provider}</td>
                      <td className="px-4 py-3">{video.watchedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
