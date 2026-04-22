
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      
    <main className="min-h-screen bg-[#f6f6f6] pb-12 pt-0">

<section className="bg-[#cbefe1]">
  <div className="mx-auto max-w-6xl px-6 text-center pt-8 md:pt-10 pb-16 md:pb-20">
    {/* CONTACT US Tag */}
    <span className="text-sm font-semibold uppercase tracking-wider text-[#5a6b73]">
      Contact Us
    </span>

    {/* Main Heading */}
    <h2 className="mt-2 text-4xl font-bold text-[#1b1f2a] md:text-5xl">
      We’d love to talk to you
    </h2>
  </div>

  {/* Cards - Ab niche aa gaye */}
  <div className="mx-auto max-w-6xl px-6">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      
      {/* Call Us Card */}
      <div className="rounded-2xl bg-white py-5 px-4 text-center shadow-md transition hover:-translate-y-1">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#cbefe1] text-[#2c7a64]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#1b1f2a]">CALL US</h3>
        <p className="mt-1 text-sm text-[#5a6b73]">+1 111 111 11000</p>
      </div>

      {/* Email Us Card */}
      <div className="rounded-2xl bg-white py-5 px-4 text-center shadow-md transition hover:-translate-y-1">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#cbefe1] text-[#2c7a64]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#1b1f2a]">EMAIL US</h3>
        <p className="mt-1 text-sm text-[#5a6b73]">hello@consultia.com</p>
      </div>

      {/* Headquarters Card */}
      <div className="rounded-2xl bg-white py-5 px-4 text-center shadow-md transition hover:-translate-y-1">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#cbefe1] text-[#2c7a64]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#1b1f2a]">HEADQUARTERS</h3>
        <p className="mt-1 text-sm text-[#5a6b73]">
          New York, NY 94105,<br />
          United States
        </p>
      </div>

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
