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

            <div className="mt-12 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                >
                  <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.1 3.3 9.43 7.87 10.95.58.1.79-.25.79-.56 0-.28-.01-1.2-.02-2.17-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.71.08-.71 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.53-2.56-.29-5.25-1.28-5.25-5.72 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.19 1.18a11.03 11.03 0 0 1 5.8 0c2.22-1.5 3.18-1.18 3.18-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.45-2.7 5.42-5.27 5.7.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.67.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] text-slate-400 uppercase">Developed By</p>
                <p className="mt-1 font-medium text-white">chrisrnojo404</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center py-2 lg:py-8">
          {children}
        </section>
      </div>
    </div>
  )
}
