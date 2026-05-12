import Card from "@/components/Card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950">
      
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-100 mb-8">Dashboard</h1>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Total URLs">
            <div className="text-3xl font-bold text-indigo-400">0</div>
          </Card>
          <Card title="Citations Found">
            <div className="text-3xl font-bold text-emerald-400">0</div>
          </Card>
          <Card title="Citation Rate">
            <div className="text-3xl font-bold text-amber-400">0%</div>
          </Card>
          <Card title="Audits Completed">
            <div className="text-3xl font-bold text-violet-400">0</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Recent Audits">
            <p className="text-slate-500 text-sm">No audits yet. Start by adding a URL.</p>
          </Card>
          
          <Card title="AI Engine Breakdown">
            <div className="space-y-2 text-sm text-slate-500">
              <p>ChatGPT: 0 citations</p>
              <p>Perplexity: 0 citations</p>
              <p>Google AI: 0 citations</p>
              <p>Bing: 0 citations</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
