interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">{title}</h2>
      <div className="text-slate-500">{children}</div>
    </div>
  );
}
