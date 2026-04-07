import Navbar from "@/components/Navbar";

const products = [
  { name: "Starter Notes Pack", price: "$12" },
  { name: "Practice Workbook", price: "$18" },
  { name: "Premium Question Bank", price: "$29" },
];

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8fbfa] px-4 pb-12 pt-28">
        <section className="mx-auto w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Shop</h1>
          <p className="mt-2 text-sm text-gray-600">Resources to support your learning journey.</p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {products.map((item) => (
              <article key={item.name} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="h-28 rounded-2xl bg-[#eaf7f2]" />
                <h2 className="mt-4 text-lg font-semibold text-gray-900">{item.name}</h2>
                <p className="mt-1 text-sm text-gray-500">Digital product</p>
                <p className="mt-4 text-xl font-bold text-[#1ec28e]">{item.price}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
