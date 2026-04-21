
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f6f6f6] pb-12 pt-0">
        
      <section className="relative isolate w-full overflow-hidden bg-[#cbefe1] py-12 md:py-14">

  {/* Background soft gradient */}
  <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(77,195,157,0.25)_0%,rgba(236,242,239,0)_70%)]" />

  {/* Left Arrow Decoration */}
  <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 opacity-40 hidden md:block">
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="h-5 w-5 border-l-2 border-t-2 border-[#6f8b93] rotate-[-45deg]"
        />
      ))}
    </div>
  </div>

  {/* Right Arrow Decoration */}
  <div className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 opacity-40 hidden md:block">
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="h-5 w-5 border-l-2 border-t-2 border-[#6f8b93] rotate-[135deg]"
        />
      ))}
    </div>
  </div>

  {/* Center Content */}
  <div className="relative mx-auto max-w-[900px] text-center px-6">

    {/* Title */}
    <h1 className="text-5xl font-extrabold text-[#1b1f2a] md:text-6xl">
      Contact Us
    </h1>

    {/* Wave Line */}
    <div className="mt-4 flex justify-center">
      <svg
        width="120"
        height="12"
        viewBox="0 0 120 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 6C10 0 20 12 30 6C40 0 50 12 60 6C70 0 80 12 90 6C100 0 110 12 120 6"
          stroke="#7c8f97"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>

    {/* Subtitle Text */}
    <p className="mt-6 text-base text-[#5a6b73] md:text-lg max-w-[600px] mx-auto">
      Get in touch with us for any questions or support. We are here to help
      you connect with the right education professionals.
    </p>

  </div>

  {/* Logo Strip Bottom */}
  <div className="relative mx-auto mt-10 max-w-[1000px] rounded-2xl bg-white py-6 px-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">

      <span className="text-lg font-semibold">logoipsum</span>
      <span className="text-lg font-semibold">LOGOIPSUM</span>
      <span className="text-lg font-semibold">Logoipsum</span>
      <span className="text-lg font-semibold">LOGOIPSUM</span>

    </div>
  </div>

      </section>







       <section className="bg-[#f3f4f6] py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
 
        {/* ================= TOP SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-8">
 
          {/* LEFT FORM */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                placeholder="Email"
                className="w-full rounded-full bg-[#cbefe1] px-5 py-3 outline-none"
              />
              <input
                placeholder="Phone"
                className="w-full rounded-full bg-[#cbefe1] px-5 py-3 outline-none"
              />
            </div>
 
            <input
              placeholder="Name"
              className="w-full rounded-full bg-[#cbefe1] px-5 py-3 outline-none"
            />
 
            <textarea
              placeholder="Message"
              rows={5}
              className="w-full rounded-2xl bg-[#cbefe1] px-5 py-4 outline-none resize-none"
            />
 
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full">
              Submit Button
            </button>
          </div>
 
          {/* RIGHT NEWSLETTER */}
          <div className="bg-[#2e4f46] text-white rounded-2xl p-8 relative overflow-hidden">
 
            {/* subtle circle bg */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:20px_20px]" />
 
            <div className="relative">
              <h3 className="text-xl font-semibold">Our Newsletters</h3>
              <p className="text-sm mt-3 text-white/80">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Ut elit tellus luctus nec ullamcorper mattis.
              </p>
 
              <input
                placeholder="Email"
                className="mt-6 w-full rounded-full px-4 py-3 text-black outline-none"
              />
 
              <button className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-full">
                Submit Button
              </button>
            </div>
          </div>
        </div>
 
        {/* ================= CONTACT CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
 
          {/* PHONE */}
          <div className="bg-[#2e4f46] text-white rounded-2xl p-6">
            <Phone className="mb-4" />
            <p className="font-semibold text-lg">(+876) 765 665</p>
            <p className="text-sm mt-2 text-white/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
 
          {/* EMAIL */}
          <div className="bg-[#cbefe1] rounded-2xl p-6">
            <Mail className="mb-4 text-[#2e4f46]" />
            <p className="font-semibold text-lg text-[#2e4f46]">
              mail@influenca.id
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
 
          {/* LOCATION */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <MapPin className="mb-4 text-[#6b8f95]" />
            <p className="font-semibold text-lg text-[#1e2a55]">
              London Eye London
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
 
        {/* ================= MAP ================= */}
        <div className="mt-10 rounded-2xl overflow-hidden">
          <iframe
            title="London map"
            src="https://maps.google.com/maps?q=london&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[300px] border-0"
          ></iframe>
        </div>
      </div>
    </section>

        
      </main>

      <Footer />
    </>
  );
}
