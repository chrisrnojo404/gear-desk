import type { PropsWithChildren } from 'react'
import { LogoMark } from '../components/common/LogoMark'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="panel-glow rounded-[2rem] border border-white/10 bg-panel-900/85 p-10">
            <LogoMark />
            <p className="mt-10 text-sm tracking-[0.2em] text-brand-100/70 uppercase">
              Mediaorganisatie controlecentrum
            </p>
            <h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-tight text-white">
              Het dashboard voor apparatuur, planning en productieflow.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Een moderne werkplek voor newsroom teams, studio-operaties en technische administratie,
              met aparte omgevingen voor aanvragers, verwerkers en admins.
            </p>
          </div>
        </section>

        <section className="flex w-full items-center justify-center py-2 lg:py-8">
          {children}
        </section>
      </div>
    </div>
  )
}
