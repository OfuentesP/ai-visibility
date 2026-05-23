import Link from 'next/link'

export const metadata = {
  title: 'Página no encontrada | Ai Visibility',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">404</p>
      <h1 className="text-2xl font-semibold text-slate-200 mb-3">Esta página no existe</h1>
      <p className="text-slate-500 text-sm mb-8 max-w-xs">
        La URL que buscas no está disponible. Puedes auditar tu marca o revisar el glosario.
      </p>
      <div className="flex gap-3">
        <Link
          href="/auditar"
          className="px-5 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          Ir a la herramienta
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm transition-colors"
        >
          Inicio
        </Link>
      </div>
    </div>
  )
}
