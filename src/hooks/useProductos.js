import { useState, useEffect } from 'react'
import { getProductos } from '../api/productos'

export function useProductos(categoria) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const res = await getProductos(categoria)
        const data = (res.data || []).map(p => ({
          ...p,
          imagen: p.imagen || p.imagenUrl,
          imagenUrl: p.imagen || p.imagenUrl,
        }))
        setProductos(data)
      } catch (err) {
        setError('Error al cargar productos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [categoria])

  return { productos, loading, error }
}