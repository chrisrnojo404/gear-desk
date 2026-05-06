export function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg shadow-brand-900/30">
        <div className="grid h-7 w-7 grid-cols-2 grid-rows-2 gap-1">
          <span className="rounded-md bg-brand-500" />
          <span className="rounded-md bg-white/80" />
          <span className="rounded-md bg-white/45" />
          <span className="rounded-md bg-brand-100" />
        </div>
      </div>
      <div>
        <p className="font-display text-lg font-semibold tracking-[0.18em] text-white uppercase">
          Gear Desk
        </p>
        <p className="text-xs tracking-[0.22em] text-slate-400 uppercase">
          Media Equipment Control
        </p>
      </div>
    </div>
  )
}
