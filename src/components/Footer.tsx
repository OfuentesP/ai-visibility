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
              <span className="text-slate-200 text-sm font-semibold">AI Visibility</span>
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

          {/* Conceptos */}
          <div>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Conceptos</p>
            <ul className="space-y-2">
              <li><Link href="/glosario/alucinacion-ia/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Alucinación de IA</Link></li>
              <li><Link href="/glosario/auditoria-arquetipos/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Auditoría por Arquetipos</Link></li>
              <li><Link href="/#faq-geo" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/auditar/" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">Auditoría gratuita</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/40 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-slate-700 text-[11px] font-mono">
            © {year} AI Visibility · Datos procesados con GPT-4o · Chile
          </p>
          <p className="text-slate-800 text-[10px] font-mono">
            GEO · AEO · SoM · RAG · LLM
          </p>
        </div>

      </div>
    </footer>
  )
}
