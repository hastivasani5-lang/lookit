import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { getUserById } from "@/lib/user-store";
import { getProfessionalLibrary } from "@/lib/content-library-store";

function splitCategories(specialization: string | undefined) {
  if (!specialization) {
    return [];
  }

  return specialization
    .split(/[,|/]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function AdminProfessionalUploadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();

  if (cookieStore.get("admin_session")?.value !== "authorized") {
    redirect("/admin");
  }

  const { id } = await params;
  const user = await getUserById(id);

  if (!user || user.role !== "professional") {
    notFound();
  }

  const library = await getProfessionalLibrary(id);
  const categories = Array.from(new Set([...library.categories, ...splitCategories(user.specialization)]));

  return (
    <main className="min-h-screen bg-[#eef0fb] p-4 sm:p-6">
      <section className="mx-auto w-full max-w-6xl space-y-5 rounded-3xl bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.14)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Professional Details</h1>
            <p className="mt-1 text-sm text-slate-500">{user.name} • {user.email}</p>
          </div>
          <Link href="/admin" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Back to Admin
          </Link>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <p className="text-sm text-slate-700"><span className="font-semibold">Contact:</span> {user.contactNumber || "-"}</p>
          <p className="text-sm text-slate-700"><span className="font-semibold">Location:</span> {user.location || "-"}</p>
          <p className="text-sm text-slate-700 sm:col-span-2"><span className="font-semibold">Categories:</span> {categories.length ? categories.join(", ") : "-"}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Uploaded Books</h2>
          {library.books.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No books uploaded yet.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Book</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">MRP</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3 text-right">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {library.books.map((book) => (
                    <tr key={book.id} className="border-t border-slate-100 text-slate-700">
                      <td className="px-4 py-3 font-medium text-slate-800">{book.name}</td>
                      <td className="px-4 py-3">{book.category}</td>
                      <td className="px-4 py-3">₹{book.mrp}</td>
                      <td className="px-4 py-3 capitalize">{book.source}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          {book.url ? (
                            <a href={book.url} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                              Open
                            </a>
                          ) : (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400">N/A</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Uploaded Videos</h2>
          {library.videos.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No videos uploaded yet.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Video</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Size/Type</th>
                    <th className="px-4 py-3 text-right">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {library.videos.map((video) => (
                    <tr key={video.id} className="border-t border-slate-100 text-slate-700">
                      <td className="px-4 py-3 font-medium text-slate-800">{video.name}</td>
                      <td className="px-4 py-3 capitalize">{video.source}</td>
                      <td className="px-4 py-3">{video.sizeLabel}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          {video.url ? (
                            <a href={video.url} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                              Open
                            </a>
                          ) : (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400">N/A</span>
                          )}
                        </div>
                      </td>
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
