"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-white pt-16 px-4 md:px-10 lg:px-16">

      <div className="max-w-7xl mx-auto">

        {/* ================= TOP NEWSLETTER ================= */}
        <div className="bg-[#1c1c1c] rounded-[20px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-16">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="text-green-400 text-2xl">📖</div>
            <h2 className="text-xl font-semibold">Educate</h2>
          </div>

          {/* TEXT */}
          <h3 className="text-lg md:text-xl font-semibold">
            SUBSCRIB <span className="text-[#1ec28e]">NEWSLETTER</span>
          </h3>

          {/* INPUT */}
          <div className="flex items-center bg-[#111] border border-gray-700 rounded-full px-4 py-2 w-full md:w-[350px]">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="bg-transparent outline-none flex-1 text-sm text-gray-300"
            />
            <button className="bg-[#1ec28e] w-10 h-10 rounded-full flex items-center justify-center text-white">
              ➤
            </button>
          </div>

        </div>

        {/* ================= MAIN FOOTER ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* GET IN TOUCH */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Educate the ultimate destination for We are committed to transforming without standards
            </p>

            <p className="flex items-center gap-2 text-white font-semibold mb-2">
              📞 +123 (4567) 890
            </p>

            <p className="flex items-center gap-2 text-gray-400 text-sm">
              ✉ example@gmail.com
            </p>
          </div>

          {/* ONLINE PLATFORM */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Online Platform</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>➜ About Us</li>
              <li>➜ Our Courses</li>
              <li>➜ Instructors</li>
              <li>➜ Enroll Now</li>
              <li>➜ Career</li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>➜ Latest Blog</li>
              <li>➜ Our Gallary</li>
              <li>➜ Contact Us</li>
              <li>➜ Privacy Policy</li>
              <li>➜ FAQ’s</li>
            </ul>
          </div>

          {/* RECENT POSTS */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Recent Posts</h3>

            <div className="space-y-4">

              {/* POST 1 */}
              <div className="flex gap-3">
                <Image
                  src="/blog1.jpg"
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                  alt=""
                />
                <div>
                  <p className="text-sm">
                    10 Proven Strategies to Online Learning
                  </p>
                  <p className="text-[#1ec28e] text-xs">8 Jan, 2025</p>
                </div>
              </div>

              {/* POST 2 */}
              <div className="flex gap-3">
                <Image
                  src="/blog2.jpg"
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                  alt=""
                />
                <div>
                  <p className="text-sm">
                    Trends that are shaping the Learning...
                  </p>
                  <p className="text-[#1ec28e] text-xs">8 Jan, 2025</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ================= BOTTOM ================= */}
        <div className="border-t border-gray-800 pt-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-400 text-sm">
            © 2025 <span className="text-[#1ec28e]">Educate</span>. Designed By Dream IT Solution
          </p>

          {/* SOCIAL */}
          <div className="flex gap-3">
            {["f", "x", "in", "p"].map((item, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-[#1c1c1c] flex items-center justify-center text-sm"
              >
                {item}
              </div>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}