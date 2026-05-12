import Card from "@/components/Card";

export default function Audits() {
  return (
    <div className="min-h-screen bg-slate-950">
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Audits</h1>
          <button className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-sm font-semibold hover:bg-indigo-500 transition text-sm">
            New Audit
          </button>
        </div>

        <Card title="Your Audits">
          <p className="text-slate-500 text-sm">No audits yet. Create one to get started.</p>
        </Card>
      </main>
    </div>
  );
}
