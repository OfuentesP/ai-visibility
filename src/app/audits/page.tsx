import Card from "@/components/Card";

export default function Audits() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Audits</h1>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            New Audit
          </button>
        </div>

        <Card title="Your Audits">
          <p className="text-gray-500">No audits yet. Create one to get started.</p>
        </Card>
      </main>
    </div>
  );
}
