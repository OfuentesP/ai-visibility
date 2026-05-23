import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                AI
              </span>
              <span className="text-slate-200 text-sm font-semibold">Ai Visibility</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-xs">
              Plataforma de auditoría para Generative Engine Optimization (GEO).
              Mide el Share of Model de tu marca en ChatGPT, Perplexity y Claude.
            </p>
          </div>

          {/* Herramienta */}
          <div>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Herramienta</p>
            <ul className="space-y-2">
              <li><Link href="/auditar/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Auditar mi marca</Link></li>
              <li><Link href="/auditar/saas/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">GEO para SaaS</Link></li>
              <li><Link href="/auditar/retail/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">GEO para Retail</Link></li>
              <li><Link href="/auditar/salud/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">GEO para Salud</Link></li>
              <li><Link href="/auditar/banca/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">GEO para Banca</Link></li>
              <li><Link href="/auditar/pyme/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">GEO para Pymes</Link></li>
              <li><Link href="/auditar/inmobiliaria/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">GEO para Inmobiliaria</Link></li>
            </ul>
          </div>

          {/* Glosario */}
          <div>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Glosario GEO</p>
            <ul className="space-y-2">
              <li><Link href="/glosario/geo/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Generative Engine Optimization</Link></li>
              <li><Link href="/glosario/share-of-model/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Share of Model (SoM)</Link></li>
              <li><Link href="/glosario/aeo/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Answer Engine Optimization</Link></li>
              <li><Link href="/glosario/seo/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">SEO vs GEO</Link></li>
              <li><Link href="/glosario/rag/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">RAG</Link></li>
              <li><Link href="/glosario/llm/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">LLM</Link></li>
              <li><Link href="/glosario/" className="text-slate-500 text-xs hover:text-indigo-400 transition-colors">Ver todos →</Link></li>
            </ul>
          </div>

          {/* Guías y conceptos */}
          <div>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Guías</p>
            <ul className="space-y-2">
              <li><Link href="/guias/cyberday-2026-chatgpt/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">CyberDay 2026 y ChatGPT</Link></li>
              <li><Link href="/glosario/alucinacion-ia/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Alucinación de IA</Link></li>
              <li><Link href="/glosario/auditoria-arquetipos/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Auditoría por Arquetipos</Link></li>
              <li><Link href="/#faq-geo" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/auditar/" className="text-slate-500 text-xs hover:text-indigo-400 transition-colors">Auditoría gratuita →</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/40 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-slate-700 text-[11px] font-mono">
            © {year} Ai Visibility · Datos procesados con GPT-4o · Chile
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="Instagram"
              className="text-slate-500 hover:text-pink-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-slate-500 hover:text-sky-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <p className="text-slate-800 text-[10px] font-mono">
              GEO · AEO · SoM · RAG · LLM
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
