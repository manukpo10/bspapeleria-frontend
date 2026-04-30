import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, BookOpen, Users, Award, CheckCircle, Play, Calendar, MessageCircle, Lock, ShoppingCart, ChevronDown, ChevronRight, Loader2 } from 'lucide-react'
import Button from '../components/ui/Button'
import useAuthStore from '../store/useAuthStore'
import useCartStore from '../store/useCartStore'
import { getCursos, getCursoById } from '../api/cursos'

function AccordionModule({ modulo, index }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border border-sand/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-cream/50 hover:bg-cream transition"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
            {index + 1}
          </span>
          <span className="font-medium text-dark">{modulo.titulo}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-dark/40">{modulo.duracion}</span>
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-sand/30">
          <ul className="space-y-2">
            {(modulo.lecciones || []).map((leccion, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-dark/60">
                <Play size={14} className="text-primary" />
                {leccion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function CursoDetalle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { addItem, items } = useCartStore()
  const [loading, setLoading] = useState(true)
  const [curso, setCurso] = useState(null)
  const [cursosTodos, setCursosTodos] = useState([])
  
  useEffect(() => {
    Promise.all([getCursos(), slug && !isNaN(slug) ? getCursoById(slug).catch(() => null) : null])
      .then(([res, cursoData]) => {
        const todos = (res.data || []).map(c => ({
          ...c,
          imagen: c.imagen || c.imagenUrl,
          slug: c.slug || c.titulo?.toLowerCase().replace(/\s+/g, '-'),
        }))
        setCursosTodos(todos)
        
        // Buscar por slug o ID
        console.log('Buscando curso:', slug, 'en', todos.map(c => c.slug || c.id))
        const slugLower = slug?.toLowerCase()
        const encontrado = todos.find(c => 
          c.slug === slug || 
          c.slug?.toLowerCase() === slugLower ||
          c.id === Number(slug) || 
          c.id?.toString() === slug ||
          (slug?.includes('-') && c.slug?.includes(slug.split('-')[0]))
        )
        
        // Agregar campos por defecto si no existen
        const cursoCompleto = encontrado ? {
          ...encontrado,
          descripcionCompleta: encontrado.descripcionCompleta || encontrado.descripcion || 'Descripción del curso',
          incluye: encontrado.incluye || ['Videos clases', 'Material descargable', 'Certificado'],
          modulos: encontrado.modulos || [{ titulo: 'Contenido del curso', duracion: 'A definir', lecciones: ['Clase 1'] }],
          duracion: encontrado.duracion || '0 horas',
          clases: encontrado.clases || 1,
          instructor: encontrado.instructor || 'BS Papelería',
          nivel: encontrado.nivel || 'intermedio',
          modalidad: encontrado.modalidad || 'online',
        } : null
        
        console.log('Encontrado:', cursoCompleto)
        setCurso(cursoCompleto)
      })
      .catch(() => setCurso(null))
      .finally(() => setLoading(false))
  }, [slug])
  
// El curso ya se cargó en el useEffect

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  const enCarrito = items.some(i => i.referenciaId === curso?.id && i.tipoItem === 'CURSO')
  
  const handleAddToCart = () => {
    addItem({
      referenciaId: curso.id,
      tipoItem: 'CURSO',
      nombre: curso.titulo,
      precio: curso.precio,
      imagenUrl: curso.imagenUrl,
    })
    navigate('/carrito')
  }
  
  if (!curso) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-dark mb-4">Curso no encontrado</h2>
          <Link to="/cursos" className="text-primary hover:underline">
            ← Volver a cursos
          </Link>
        </div>
      </div>
    )
  }
  
  const precio = curso.precio ? `$${curso.precio.toLocaleString('es-AR')}` : 'Consultar'
  const tieneDescuento = curso.precioOriginal && curso.precio
  
  // Determinar estado del usuario
  const isLoggedIn = isAuthenticated && user
  const isAdmin = user?.rol === 'ADMIN'
  const hasPurchased = isAdmin || enCarrito // Admin siempre tiene acceso, o si está en el carrito
  const canPurchase = isLoggedIn && !enCarrito && curso.disponible
  
  // Mensaje según estado
  const getAccessMessage = () => {
    if (!curso.disponible) {
      return { text: 'Este curso aún no está disponible', type: 'secondary' }
    }
    if (!isLoggedIn) {
      return { text: 'Iniciá sesión para comprar este curso', type: 'login' }
    }
    if (!hasPurchased) {
      return { text: 'Inscribite para acceder al contenido completo', type: 'purchase' }
    }
    return null
  }
  
  const accessMessage = getAccessMessage()
  
  return (
    <div className="min-h-screen bg-cream">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-cream to-accent/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/cursos" 
            className="inline-flex items-center gap-2 text-dark/60 hover:text-primary transition mb-6"
          >
            <ArrowLeft size={18} />
            Volver a cursos
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Info del curso */}
          <div className="lg:col-span-2">
            {/* Imagen y badges */}
            <div className="relative rounded-3xl overflow-hidden mb-8">
              <img 
                src={curso.imagen} 
                alt={curso.titulo}
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white/90 backdrop-blur-sm text-primary text-sm font-bold px-3 py-1 rounded-full">
                    {curso.categoria}
                  </span>
                  {curso.badge && (
                    <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                      {curso.badge}
                    </span>
                  )}
                  {!curso.disponible && (
                    <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full">
                      🚀 Próximamente
                    </span>
                  )}
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-black text-white">
                  {curso.titulo}
                </h1>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-dark/60">
                <Clock size={18} className="text-primary" />
                <span>{curso.duracion}</span>
              </div>
              <div className="flex items-center gap-2 text-dark/60">
                <BookOpen size={18} className="text-primary" />
                <span>{curso.clases} clases</span>
              </div>
              <div className="flex items-center gap-2 text-dark/60">
                <Users size={18} className="text-primary" />
                <span>{curso.instructor}</span>
              </div>
              <div className="flex items-center gap-2 text-dark/60">
                <Award size={18} className="text-primary" />
                <span className="capitalize">{curso.nivel}</span>
              </div>
              <div className="flex items-center gap-2 text-dark/60">
                <Calendar size={18} className="text-primary" />
                <span>{curso.modalidad}</span>
              </div>
            </div>
            
            {/* Descripción */}
            <div className="bg-white rounded-2xl p-6 border border-sand/30 mb-8">
              <h2 className="font-heading text-xl font-bold text-dark mb-4">Sobre este curso</h2>
              <p className="text-dark/70 leading-relaxed">{curso.descripcionCompleta}</p>
            </div>
            
            {/* Instructor */}
            <div className="bg-white rounded-2xl p-6 border border-sand/30 mb-8">
              <h2 className="font-heading text-xl font-bold text-dark mb-4">Instructor</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {(curso.instructor || 'B').charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-dark">{curso.instructor || 'BS Papelería'}</p>
                  <p className="text-sm text-dark/50">Instructor certificado</p>
                </div>
              </div>
            </div>
            
            {/* Programa / Módulos - solo mostrar si tiene acceso */}
            <div className="bg-white rounded-2xl p-6 border border-sand/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-dark">Programa del curso</h2>
                {!hasPurchased && (
                  <Lock size={18} className="text-dark/30" />
                )}
              </div>
              
              {!hasPurchased ? (
                <div className="text-center py-8 bg-cream/50 rounded-xl">
                  <Lock size={32} className="text-dark/30 mx-auto mb-3" />
                  <p className="text-dark/50 mb-4">
                    El contenido completo está disponible al Inscribirte al curso
                  </p>
                  {canPurchase && (
                    <Button onClick={handleAddToCart}>Inscribirse para ver el programa</Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {curso.modulos.map((modulo, index) => (
                    <AccordionModule 
                      key={index} 
                      modulo={modulo} 
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar de compra/acceso */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-sand/30 p-6">
              {/* Estado del precio */}
              <div className="text-center mb-6">
                {hasPurchased ? (
                  <span className="font-heading text-2xl font-bold text-green-600">
                    ✓ Comprado
                  </span>
                ) : curso.disponible ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="font-heading text-3xl font-black text-primary">
                        {precio}
                      </span>
                      {tieneDescuento && (
                        <span className="text-lg text-dark/40 line-through">
                          ${curso.precioOriginal.toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>
                    {tieneDescuento && (
                      <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                        {Math.round((1 - curso.precio / curso.precioOriginal) * 100)}% OFF
                      </span>
                    )}
                  </>
                ) : (
                  <span className="font-heading text-2xl font-bold text-secondary">
                    Consultar
                  </span>
                )}
              </div>
              
              {/* Botones según estado */}
              <div className="space-y-3">
                {hasPurchased ? (
                  <Link to={`/cursos/${slug}/aula`}>
                    <Button className="w-full mb-4" size="lg">
                      🎓 Ir al aula virtual
                    </Button>
                  </Link>
                ) : !isLoggedIn ? (
                  <>
                    <Link to="/login" className="block">
                      <Button className="w-full mb-4" size="lg">
                        🔐 Iniciar sesión
                      </Button>
                    </Link>
                    <Link to="/registro" className="block">
                      <Button className="w-full mb-4" size="lg" variant="outline">
                        Crear cuenta
                      </Button>
                    </Link>
                  </>
                ) : canPurchase ? (
                  <>
                    <Button className="w-full mb-4" size="lg" onClick={handleAddToCart}>
                      🛒 Inscribirse ahora
                    </Button>
                    <a 
                      href="https://wa.me/549221xxxxxxx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-sand rounded-xl font-medium text-dark hover:bg-green-500 hover:text-white hover:border-green-500 transition"
                    >
                      <MessageCircle size={18} />
                      Consultar por WhatsApp
                    </a>
                  </>
                ) : (
                  <Button className="w-full mb-4" size="lg" variant="secondary" disabled>
                    Curso no disponible
                  </Button>
                )}
              </div>
              
              <p className="text-center text-sm text-dark/40 mt-4">
                🔒 Pago 100% seguro
              </p>
              
              {/* Incluye */}
              <div className="mt-6 pt-6 border-t border-sand/30">
                <h3 className="font-bold text-dark mb-4">🎁 Al Inscribirte:</h3>
                <ul className="space-y-3">
                  {curso.incluye.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-dark/60">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Beneficios */}
              <div className="mt-6 pt-6 border-t border-sand/30">
                <h3 className="font-bold text-dark mb-4">✨ Beneficios:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-dark/60">
                    <Award size={16} className="text-accent flex-shrink-0" />
                    Acceso para siempre
                  </li>
                  <li className="flex items-center gap-2 text-sm text-dark/60">
                    <Award size={16} className="text-accent flex-shrink-0" />
                    Certificado de finalización
                  </li>
                  <li className="flex items-center gap-2 text-sm text-dark/60">
                    <Award size={16} className="text-accent flex-shrink-0" />
                    Actualizaciones gratuitas
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}