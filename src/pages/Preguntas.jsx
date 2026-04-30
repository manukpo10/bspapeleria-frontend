import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

const faqs = [
  {
    pregunta: '¿Cómo realizo un pedido personalizado?',
    respuesta: 'Podés contactarnos a través de nuestro formulario de contacto o directamente por WhatsApp. Nos encantaría escuchar tus ideas y adaptarlas a tus necesidades.',
  },
  {
    pregunta: '¿Qué medios de pago aceptan?',
    respuesta: 'Aceptamos transferencia bancaria, MercadoPago y efectivo en nuestra tienda física. También tenemos planes de pago para pedidos grandes.',
  },
  {
    pregunta: '¿Hacen envíos a todo el país?',
    respuesta: 'Sí, enviamos a todo Argentina. Los envíos se realizan por Correo Argentino o empresas de courier. El costo depende del peso y destino.',
  },
  {
    pregunta: '¿Cuánto tiempo demora un pedido personalizado?',
    respuesta: 'Los tiempos varían según la complejidad del pedido. En promedio, los productos personalizados demoran entre 5-10 días hábiles. Los cursos online están disponibles inmediatamente después de la compra.',
  },
  {
    pregunta: '¿Puedo retirar mi pedido en persona?',
    respuesta: 'Sí, tenemos punto de retiro en zona de La Plata. También podés visitarnos para ver nuestros productos en persona.',
  },
  {
    pregunta: '¿Los cursos son presenciales u online?',
    respuesta: 'Ofrecemos ambas modalidades. Los cursos online están disponibles en nuestra plataforma, mientras que los presenciales se realizan en nuestra sede.',
  },
  {
    pregunta: '¿Qué incluye el material de los cursos?',
    respuesta: 'Cada curso incluye material descargable, videos-tutoriales paso a paso y acceso a nuestra comunidad privada de alumnos.',
  },
  {
    pregunta: '¿Tienen política de devolución?',
    respuesta: 'Sí, aceptamos devoluciones dentro de los 15 días de recibido el producto si este presenta defectos. Los productos personalizados no tienen devolución.',
  },
]

export default function Preguntas() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/20 via-cream to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-sand text-primary text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <MessageCircle size={14} />
            Estamos para ayudarte
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-dark mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-dark/60 text-lg max-w-2xl mx-auto">
            Encontrá respuestas a las dudas más comunes sobre nuestros productos, cursos y servicios
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 -mt-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl border border-sand/30 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-sand/20 transition"
                >
                  <span className="font-bold text-dark pr-4">{faq.pregunta}</span>
                  <ChevronDown 
                    className={`text-primary transition-transform duration-300 flex-shrink-0 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 pb-6 text-dark/60">{faq.respuesta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto extra */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-dark mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-dark/50 mb-6">
            Escribinos y te respondemos en menos de 2 horas
          </p>
          <Link to="/contacto">
            <Button size="lg">
              Contactanos
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}