import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Ingresá un email válido');
      return;
    }
    setSubmitted(true);
    toast.success('¡Gracias por suscribirte!');
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-sand/50 p-10 sm:p-16 text-center"
        >
          <span className="block font-script text-2xl text-secondary mb-2">Newsletter</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark mb-4">
            Sumate a la comunidad
          </h2>
          <p className="text-dark/60 mb-8 max-w-lg mx-auto">
            Recibí ofertas exclusivas, novedades de cursos y tips creativos directo en tu inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-success font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              ¡Ya estás suscripto!
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-2xl border border-sand bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors active:scale-[0.98]"
              >
                <Send className="w-4 h-4" /> Suscribirme
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
