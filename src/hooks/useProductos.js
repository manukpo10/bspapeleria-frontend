import { useState, useEffect, useMemo } from 'react'
import { productos as productosData } from '../data/productosData'

export function useProductos(categoria) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga rápida
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  const productos = useMemo(() => {
    if (!categoria) return productosData
    return productosData.filter(p => p.categoria === categoria)
  }, [categoria])

  return { productos, loading, error: null }
}