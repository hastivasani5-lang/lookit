import Image from "next/image";
import Link from "next/link";

export default function AlertPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] bg-white px-6 py-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)] md:px-10 md:py-14">
        <div className="mx-auto mb-8 max-w-md overflow-hidden rounded-[28px] bg-[#fff5f5] p-4 shadow-inner">
          <Image
            src="/alert.jpg"
            alt="Alert"
            width={900}
            height={700}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-red-600 md:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-slate-500 md:text-lg">
          The email address you entered is not registered or is invalid. Please go back to the home page and try again.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
