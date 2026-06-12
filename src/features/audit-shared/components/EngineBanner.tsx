// Chip que identifica el motor (ChatGPT / Gemini) sobre cada bloque de un
// informe multimotor. Espejo del banner del email (_engine_banner en main.py).

export function EngineBanner({ motor }: { motor: 'chatgpt' | 'gemini' }) {
  const label = motor === 'chatgpt' ? 'ChatGPT (OpenAI)' : 'Gemini (Google)'
  const dot = motor === 'chatgpt' ? 'bg-emerald-500' : 'bg-sky-500'
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-xs font-semibold text-slate-700">Motor: {label}</span>
      </div>
    </div>
  )
}
