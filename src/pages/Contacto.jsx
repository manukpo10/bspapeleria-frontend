import { useState } from 'react'
import { Mail, MapPin, Phone, Instagram, Clock, Send } from 'lucide-react'
import Button from '../components/ui/Button'

const contactInfo = [
  { icon: Mail,      label: 'Email',      value: 'hola@bspapeleria.com',    href: 'mailto:hola@bspapeleria.com' },
  { icon: Phone,     label: 'Telefono',   value: '+54 221 123-4567',        href: 'tel:+5422112345567' },
  { icon: MapPin,    label: 'Ubicacion',  value: 'La Plata, Buenos Aires',  href: null },
  { icon: Instagram, label: 'Instagram',  value: '@bspapeleria',            href: 'https://instagram.com' },
]

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1000)
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero contacto */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src="https://picsum.photos/seed/contacto-hero/1400/400"
          alt="Contacto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-dark/60 to-primary/30" />
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
              Contacto
            </h1>
            <p className="text-white/70 text-lg">Estamos para ayudarte. Escribinos cuando quieras.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Info + mapa */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="font-heading text-2xl font-bold text-dark">Encontranos aqui</h2>

            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-sand/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon size={19} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-dark/40 font-medium uppercase tracking-wider mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      className="text-dark font-medium hover:text-primary transition text-sm">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-dark font-medium text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Horario */}
            <div className="bg-gradient-to-br from-primary/10 to-sand/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-primary" />
                <h3 className="font-semibold text-dark">Horario de atencion</h3>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark/60">Lunes a viernes</span>
                  <span className="font-medium text-dark">9:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Sabados</span>
                  <span className="font-medium text-dark">10:00 – 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/60">Domingos</span>
                  <span className="text-dark/40">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Imagen decorativa */}
            <div className="rounded-2xl overflow-hidden h-40 shadow-md">
              <img
                src="https://picsum.photos/seed/contacto-deco/500/200"
                alt="BSPapeleria"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 border border-sand/30 shadow-sm">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-5">
                    <Send size={32} className="text-success" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-dark mb-2">
                    Mensaje enviado!
                  </h3>
                  <p className="text-dark/50 mb-6 leading-relaxed">
                    Gracias por escribirnos. Te responderemos en menos de 24 horas.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }) }}
                    className="text-primary font-semibold hover:text-secondary transition text-sm"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-dark mb-6">
                    Envianos un mensaje
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Nombre</label>
                        <input type="text" name="nombre" required value={form.nombre} onChange={handleChange}
                          className="input-base" placeholder="Tu nombre" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Email</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange}
                          className="input-base" placeholder="hola@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">Asunto</label>
                      <select name="asunto" value={form.asunto} onChange={handleChange}
                        className="input-base appearance-none cursor-pointer">
                        <option value="">Selecciona un motivo...</option>
                        <option>Consulta sobre productos</option>
                        <option>Informacion sobre cursos</option>
                        <option>Seguimiento de pedido</option>
                        <option>Devoluciones y cambios</option>
                        <option>Propuesta de curso</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">Mensaje</label>
                      <textarea name="mensaje" required rows={5} value={form.mensaje} onChange={handleChange}
                        className="input-base resize-none"
                        placeholder="En que podemos ayudarte?" />
                    </div>
                    <Button type="submit" className="w-full" size="lg" loading={loading}>
                      <Send size={17} />
                      Enviar mensaje
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
