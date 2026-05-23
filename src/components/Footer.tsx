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
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Plataforma de auditoría para Generative Engine Optimization (GEO).
              Mide el Share of Model de tu marca en ChatGPT, Perplexity y Claude.
            </p>
            <p className="text-slate-500 text-xs mt-3 leading-relaxed">
              Av. Apoquindo 4501, Of. 12<br />
              Las Condes, Santiago, Chile
            </p>
          </div>

          {/* Herramienta */}
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Herramienta</p>
            <ul className="space-y-2">
              <li><Link href="/auditar/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">Auditar mi marca</Link></li>
              <li><Link href="/auditar/saas/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">GEO para SaaS</Link></li>
              <li><Link href="/auditar/retail/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">GEO para Retail</Link></li>
              <li><Link href="/auditar/salud/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">GEO para Salud</Link></li>
              <li><Link href="/auditar/banca/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">GEO para Banca</Link></li>
              <li><Link href="/auditar/pyme/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">GEO para Pymes</Link></li>
              <li><Link href="/auditar/inmobiliaria/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">GEO para Inmobiliaria</Link></li>
            </ul>
          </div>

          {/* Glosario */}
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Glosario GEO</p>
            <ul className="space-y-2">
              <li><Link href="/glosario/geo/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">Generative Engine Optimization</Link></li>
              <li><Link href="/glosario/share-of-model/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">Share of Model (SoM)</Link></li>
              <li><Link href="/glosario/aeo/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">Answer Engine Optimization</Link></li>
              <li><Link href="/glosario/seo/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">SEO vs GEO</Link></li>
              <li><Link href="/glosario/rag/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">RAG</Link></li>
              <li><Link href="/glosario/llm/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">LLM</Link></li>
              <li><Link href="/glosario/" className="text-slate-400 text-xs hover:text-indigo-400 transition-colors">Ver todos →</Link></li>
            </ul>
          </div>

          {/* Guías y conceptos */}
          <div>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Guías</p>
            <ul className="space-y-2">
              <li><Link href="/guias/cyberday-2026-chatgpt/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">CyberDay 2026 y ChatGPT</Link></li>
              <li><Link href="/glosario/alucinacion-ia/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">Alucinación de IA</Link></li>
              <li><Link href="/glosario/auditoria-arquetipos/" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">Auditoría por Arquetipos</Link></li>
              <li><Link href="/#faq-geo" className="text-slate-400 text-xs hover:text-slate-300 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/auditar/" className="text-slate-400 text-xs hover:text-indigo-400 transition-colors">Auditoría gratuita →</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/40 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-slate-500 text-[11px] font-mono">
            © {year} Ai Visibility · Datos procesados con GPT-4o · Chile
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://wa.me/56912345678?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20Ai%20Visibility"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-slate-500 hover:text-[#25D366] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
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
