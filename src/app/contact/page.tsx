import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f7f6] px-4 pb-12 pt-28">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Contact Us</h1>
          <p className="mt-2 text-sm text-gray-600">Have questions? Send us a message.</p>

          <form className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
            <textarea
              rows={5}
              placeholder="Your Message"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary"
            />
            <button
              type="button"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#18ab7d]"
            >
              SEND MESSAGE
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
