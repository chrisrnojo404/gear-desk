interface StatCardProps {
  label: string
  value: string | number
  helper: string
}

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="card-surface p-5 shadow-xl shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-white/7">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-4 font-display text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </article>
  )
}
