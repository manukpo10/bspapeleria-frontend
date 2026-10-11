import { useState, type FormEvent } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* The photo is the panel's backdrop (bg-ribbon shows while it loads). Its left half is empty paper,
            which is where the copy sits from md up; the plane flies in on the right */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ribbon px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16 md:text-left">
          <img
            src="/images/home/avion-papel.webp"
            alt=""
            aria-hidden="true"
            width={1536}
            height={864}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-right-top"
          />
          {/* Below md the copy covers the plane, so the veil is strong there to keep the ink text above 4.5:1;
              from md it only softens the left side and leaves the plane untouched */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-white/85 via-white/75 to-white/60 md:bg-linear-to-r md:from-white/60 md:via-white/30 md:to-transparent"
          />

          <div className="relative mx-auto max-w-xl md:mx-0 md:max-w-xs lg:max-w-md">
            <p className="font-script text-2xl text-dark">Newsletter</p>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              Sumate a la comunidad
            </h2>
            <p className="mt-3 text-dark/75">
              Recibí ofertas exclusivas, novedades de cursos y tips creativos directo en tu inbox.
            </p>

            {submitted ? (
              <div
                role="status"
                className="mt-8 inline-flex animate-fade-in items-center gap-2 rounded-full bg-white/85 px-5 py-3 font-medium text-dark"
              >
                <CheckCircle className="size-5 text-emerald-700" aria-hidden="true" />
                ¡Ya estás suscripto!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row md:mx-0 md:max-w-none md:flex-col lg:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Tu email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field h-14 min-w-0 flex-1 text-base"
                />
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send className="size-4" aria-hidden="true" /> Suscribirme
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
