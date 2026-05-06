interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({
  message = 'Sessie wordt geladen...',
}: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="panel-glow w-full max-w-md rounded-3xl border border-white/10 bg-panel-900/85 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-brand-500" />
        <p className="mt-5 text-sm text-slate-300">{message}</p>
      </div>
    </div>
  )
}
