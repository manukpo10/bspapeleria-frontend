import api from './axios'

export const getCursos = (modalidad) => {
  const params = modalidad ? { modalidad } : {}
  return api.get('/cursos', { params })
}

export const getCursoById = (id) => api.get(`/cursos/${id}`)

export const getCursoBySlug = (slug) => api.get(`/cursos/slug/${slug}`)

// Placeholder - needs backend implementation
export const checkCursoComprado = (cursoId) => 
  api.get(`/usuarios/cursos-comprados/${cursoId}`)