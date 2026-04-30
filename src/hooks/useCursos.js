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
      .then((res) => setCursos(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar cursos'))
      .finally(() => setLoading(false))
  }, [modalidad])

  return { cursos, loading, error }
}
