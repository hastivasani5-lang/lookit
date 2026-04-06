const stackItems = [
  {
    title: "Frontend",
    value: "Next.js",
    note: "App Router, TypeScript, Tailwind CSS",
  },
  {
    title: "Backend",
    value: "Node.js",
    note: "API routes or a dedicated service layer",
  },
  {
    title: "Database",
    value: "PostgreSQL",
    note: "Relational data, transactions, reporting",
  },
  {
    title: "Hosting",
    value: "AWS / Azure",
    note: "Deploy frontend, API, and managed database services",
  },
  {
    title: "Search",
    value: "ElasticSearch",
    note: "Optional indexing for fast filtering and discovery",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff8eb_0%,#f4efe6_38%,#edf0f6_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <header className="mb-10 flex items-center justify-between gap-4 rounded-full border border-white/60 bg-white/70 px-5 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
              Project Stack
            </p>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Next.js full-stack starter
            </h1>
          </div>
          <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Ready for extension
          </div>
        </header>

        <section className="grid flex-1 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <span className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
                Technology Stack
              </span>
              <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                A clean base for a Next.js frontend with Node.js, PostgreSQL, and optional search.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                This workspace is structured to support a production-style application with a modern UI,
                API layer, relational data storage, cloud hosting, and ElasticSearch if search becomes
                part of the scope.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stackItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.title}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_30%)]" />
            <div className="relative space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                  Included Layers
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Frontend, backend, data, and deployment.
                </h3>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm leading-6 text-slate-200">
                  Frontend: Next.js
                  <br />
                  Backend: Node.js
                  <br />
                  Database: PostgreSQL
                  <br />
                  Hosting: AWS / Azure
                  <br />
                  Search: ElasticSearch (optional)
                </p>
              </div>

              <p className="text-sm leading-6 text-slate-300">
                Use this starter as a base for dashboards, portals, SaaS apps, or internal tools.
                Add API routes or a separate Node service when backend work begins.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
