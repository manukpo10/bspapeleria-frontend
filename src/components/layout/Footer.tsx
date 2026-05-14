import { Link } from 'react-router-dom';
import { MessageCircle, Globe, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-semibold text-white">BS</span>
              <span className="font-script text-xl text-accent ml-2">Papelería</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Papelería boutique moderna con productos personalizados, sublimables, archivos digitales y cursos creativos.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors" aria-label="Instagram">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors" aria-label="Facebook">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/productos" className="hover:text-primary transition-colors">Productos</Link></li>
              <li><Link to="/productos?category=personalizados" className="hover:text-primary transition-colors">Personalizados</Link></li>
              <li><Link to="/productos?category=sublimables" className="hover:text-primary transition-colors">Sublimables</Link></li>
              <li><Link to="/productos?category=archivos-digitales" className="hover:text-primary transition-colors">Archivos Digitales</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-white font-semibold mb-4">Aprendé</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cursos" className="hover:text-primary transition-colors">Todos los cursos</Link></li>
              <li><Link to="/cursos?level=principiante" className="hover:text-primary transition-colors">Para principiantes</Link></li>
              <li><Link to="/cursos?level=intermedio" className="hover:text-primary transition-colors">Intermedio</Link></li>
              <li><Link to="/cursos?level=avanzado" className="hover:text-primary transition-colors">Avanzado</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>La Plata, Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:hola@bspapeleria.com" className="hover:text-primary transition-colors">hola@bspapeleria.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+54 11 1234-5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} BS Papelería. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
