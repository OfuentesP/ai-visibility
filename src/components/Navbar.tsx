import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          AI Visibility
        </Link>
        
        <div className="space-x-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
            Dashboard
          </Link>
          <Link href="/audits" className="text-gray-700 hover:text-blue-600 transition">
            Audits
          </Link>
          <Link href="/settings" className="text-gray-700 hover:text-blue-600 transition">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}
