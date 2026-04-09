import Image from "next/image";
import Link from "next/link";

const footerPages = [
  { label: "Home", href: "/" },
  { label: "Find Experts", href: "/directory" },
  { label: "Categories", href: "/categories" },
  { label: "Professionals", href: "/professionals" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#f4f6f8] px-4 pt-10 pb-7 text-[#1f2937] md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl rounded-[10px] bg-white px-5 py-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] md:px-7 md:py-7 lg:px-10 lg:py-8">
        {/* ================= TOP NEWSLETTER ================= */}
        <div className="mb-10 flex flex-col items-center justify-between gap-5 rounded-[22px] bg-[#0f5254] px-6 py-6 text-center text-white md:flex-row md:text-left md:items-center md:px-8 md:py-7">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-[0.12em] text-white/95">LOOKIT</span>
          </div>

          {/* TEXT */}
          <h3 className="text-lg font-semibold leading-tight md:text-2xl">
            SUBSCRIB <span className="text-primary">NEWSLETTER</span>
          </h3>

          {/* INPUT */}
          <div className="flex w-full items-center rounded-full border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm md:w-88">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="flex-1 bg-transparent px-3 text-sm text-white/90 placeholder:text-white/65 outline-none"
            />
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8ea93] text-[#0f5254] transition hover:bg-[#b8e27b]">
              ➤
            </button>
          </div>
        </div>

        {/* ================= MAIN FOOTER ================= */}
        <div className="mb-8 grid gap-8 border-b border-[#e9edf0] pb-8 text-center md:grid-cols-2 lg:grid-cols-3 lg:text-left">
          {/* GET IN TOUCH */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#132026]">Get in Touch</h3>
            <p className="mb-4 text-sm leading-relaxed text-[#6b7280] lg:max-w-sm">
              Educate the ultimate destination for We are committed to transforming without standards
            </p>

            <p className="mb-2 flex items-center justify-center gap-2 font-semibold text-[#132026] lg:justify-start">
              📞 +123 (4567) 890
            </p>

            <p className="flex items-center justify-center gap-2 text-sm text-[#6b7280] lg:justify-start">
              ✉ example@gmail.com
            </p>
          </div>

          {/* PAGES */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#132026]">Pages</h3>
            <ul className="space-y-3 text-sm text-[#6b7280] lg:text-left">
              {footerPages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="transition hover:text-[#0f5254]">
                    ➜ {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RECENT POSTS */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#132026]">Recent Posts</h3>

            <div className="space-y-4">
              {/* POST 1 */}
              <div className="flex justify-center gap-3 lg:justify-start">
                <Image
                  src="/blog-thumb1.png"
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                  alt=""
                />
                <div>
                  <p className="text-sm text-[#1f2937]">
                    10 Proven Strategies to Online Learning
                  </p>
                  <p className="text-xs text-primary">8 Jan, 2025</p>
                </div>
              </div>

              {/* POST 2 */}
              <div className="flex justify-center gap-3 lg:justify-start">
                <Image
                  src="/blog-thumb2.png"
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                  alt=""
                />
                <div>
                  <p className="text-sm text-[#1f2937]">
                    Trends that are shaping the Learning...
                  </p>
                  <p className="text-xs text-primary">8 Jan, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="flex flex-col items-center justify-between gap-4 pt-2 pb-2 text-center md:flex-row md:text-left">
          <p className="text-sm text-[#6b7280]">
            © 2025 <span className="text-primary">Educate</span>. Designed By Dream IT Solution
          </p>

          {/* SOCIAL */}
          <div className="flex gap-3">
            {["f", "x", "in", "p"].map((item, i) => (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ecf4ef] text-sm font-semibold text-[#0f5254] transition hover:bg-[#dceee5]"
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