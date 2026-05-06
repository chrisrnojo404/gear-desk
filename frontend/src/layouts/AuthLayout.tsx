import type { PropsWithChildren } from 'react'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex w-full max-w-xl items-center justify-center py-2 lg:py-8">
          {children}
        </section>
      </div>
    </div>
  )
}
