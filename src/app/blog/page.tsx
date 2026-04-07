import Navbar from "@/components/Navbar";

const posts = [
  "How to Build a Daily Study System",
  "5 Smart Revision Techniques",
  "Preparing for Your Next Online Course",
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-4 pb-12 pt-28">
        <section className="mx-auto w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Blog</h1>
          <p className="mt-2 text-sm text-gray-600">Latest learning tips and platform updates.</p>

          <div className="mt-8 space-y-4">
            {posts.map((title) => (
              <article key={title} className="rounded-2xl border border-gray-200 p-5 transition hover:border-[#1ec28e]">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="mt-2 text-sm text-gray-500">Read in 4 min</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
