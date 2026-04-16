import Card from "@/components/Card";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card title="Total URLs">
            <div className="text-3xl font-bold text-blue-600">0</div>
          </Card>
          <Card title="Citations Found">
            <div className="text-3xl font-bold text-green-600">0</div>
          </Card>
          <Card title="Citation Rate">
            <div className="text-3xl font-bold text-orange-600">0%</div>
          </Card>
          <Card title="Audits Completed">
            <div className="text-3xl font-bold text-purple-600">0</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card title="Recent Audits">
            <p className="text-gray-500">No audits yet. Start by adding a URL.</p>
          </Card>
          
          <Card title="AI Engine Breakdown">
            <div className="space-y-2 text-sm">
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
