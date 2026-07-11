export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-5xl mx-auto">

        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Project Freedom
        </p>

        <h1 className="text-5xl font-bold mt-4">
          Welcome Andrew 👋
        </h1>

        <p className="text-slate-400 mt-3">
          Your journey to financial independence starts here.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">

          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-slate-400">Net Worth</h2>
            <p className="text-3xl font-bold mt-2">£518,000</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-slate-400">Pensions</h2>
            <p className="text-3xl font-bold mt-2">£118,000</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-slate-400">Investments</h2>
            <p className="text-3xl font-bold mt-2">£0</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-slate-400">Property</h2>
            <p className="text-3xl font-bold mt-2">£0</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-slate-400">Savings</h2>
            <p className="text-3xl font-bold mt-2">£0</p>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <h2 className="text-slate-400">Freedom Score</h2>
            <p className="text-3xl font-bold mt-2">0%</p>
          </div>

        </div>

      </div>
    </main>
  );
}