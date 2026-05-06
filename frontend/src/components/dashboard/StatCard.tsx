interface StatCardProps {
  label: string
  value: string | number
  helper: string
}

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </article>
  )
}
