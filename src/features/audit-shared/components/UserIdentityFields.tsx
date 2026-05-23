'use client'

interface Props {
  userName: string
  userEmail: string
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
}

export function UserIdentityFields({ userName, userEmail, onNameChange, onEmailChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      <input
        type="text"
        placeholder="Tu nombre"
        value={userName}
        onChange={e => onNameChange(e.target.value)}
        className="bg-slate-900 border border-slate-700/60 rounded-sm px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
      />
      <input
        type="email"
        placeholder="tu@email.com"
        value={userEmail}
        onChange={e => onEmailChange(e.target.value)}
        className="bg-slate-900 border border-slate-700/60 rounded-sm px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
      />
    </div>
  )
}
