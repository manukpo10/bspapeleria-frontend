import { Search, X } from 'lucide-react'

export default function SearchBar({ busqueda, setBusqueda }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" />
      <input
        type="text"
        placeholder="Buscar productos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full pl-12 pr-10 py-3 rounded-xl border border-sand/50 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-dark placeholder:text-dark/30"
      />
      {busqueda && (
        <button
          onClick={() => setBusqueda('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}