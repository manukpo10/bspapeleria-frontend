import { useState, useEffect } from 'react'
import { getCursos } from '../api/cursos'

export function useCursos(modalidad) {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCursos(modalidad)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Transformar datos del backend al formato que espera el frontend
          const cursosTransformados = res.data.map(curso => ({
            ...curso,
            // Agregar campos que faltan con valores por defecto
            descripcionCorta: curso.descripcion?.substring(0, 100) + '...',
            descripcionCompleta: curso.descripcion,
            nivel: 'intermedio', // Por defecto
            clases: Math.max(1, Math.ceil((curso.duracionHoras || 8) / 0.75)), // Estimar clases
            instructor: 'BS Papelería',
            disponible: curso.activo !== false,
            slug: curso.titulo?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `curso-${curso.id}`
          }))
          setCursos(cursosTransformados)
        } else {
          setCursos([])
        }
      })
      .catch((err) => {
        console.error('Error cargando cursos:', err)
        setError(err.response?.data?.error || 'Error al cargar cursos')
        setCursos([])
      })
      .finally(() => setLoading(false))
  }, [modalidad])

  return { cursos, loading, error }
}