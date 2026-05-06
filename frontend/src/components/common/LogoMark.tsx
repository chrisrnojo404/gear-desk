export function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-300/20 bg-linear-to-br from-brand-500/30 to-white/10 shadow-lg shadow-brand-950/40">
        <div className="grid h-7 w-7 grid-cols-2 grid-rows-2 gap-1">
          <span className="rounded-md bg-brand-500" />
          <span className="rounded-md bg-brand-100" />
          <span className="rounded-md bg-white/40" />
          <span className="rounded-md bg-white/80" />
        </div>
      </div>
      <div>
        <p className="font-display text-lg font-semibold tracking-[0.18em] text-white uppercase">
          Gear Desk
        </p>
        <p className="text-xs tracking-[0.24em] text-brand-100/75 uppercase">
          Broadcast Equipment Control
        </p>
      </div>
    </div>
  )
}
