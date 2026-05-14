export default function ErrorPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-8xl font-bold text-error mb-4">500</h1>
      <p className="text-xl text-dark/60 mb-8">Algo salió mal</p>
      <button onClick={() => window.location.reload()} className="rounded-2xl bg-primary px-6 py-3 text-white font-medium hover:bg-secondary transition-colors">
        Reintentar
      </button>
    </div>
  );
}
