import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '../components/shared/SEO';
import { AuthLayout } from '../components/shared/AuthLayout';
import { api } from '../services/api';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

type FormData = z.infer<typeof schema>;

export default function RecoverPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.recoverPassword(data.email);
      setSent(true);
      toast.success('Te enviamos un email con instrucciones');
    } catch (err) {
      toast.error((err as Error).message || 'Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Recuperar Contraseña" />
      <AuthLayout
        title="Recuperar contraseña"
        description="Te enviaremos instrucciones para restablecerla"
        phrase="Todo tiene solución"
        image={{
          src: '/images/home/avion-papel.webp',
          width: 1536,
          height: 864,
          alt: 'Avión de papel violeta con estrellitas blancas sobre un fondo degradado de lila a celeste',
          className: 'object-right',
        }}
      >
        {sent ? (
          <div role="status" className="flex flex-col items-center py-4 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-mist text-emerald-700">
              <CheckCircle className="size-8" aria-hidden="true" />
            </span>
            <p className="mt-5 text-dark/75">
              Revisá tu bandeja de entrada. Te enviamos un email con las instrucciones.
            </p>
            <Link to="/login" className="btn btn-primary btn-lg mt-6">
              <ArrowRight className="size-5" aria-hidden="true" /> Volver al login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="recover-email" className="block text-sm font-medium text-dark">Email</label>
                <div className="relative mt-1.5">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dark/55"
                    aria-hidden="true"
                  />
                  <input
                    {...register('email')}
                    id="recover-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'recover-email-error' : undefined}
                    className="field pl-12"
                  />
                </div>
                {errors.email && (
                  <p id="recover-email-error" role="alert" className="mt-1.5 text-xs text-rose-700">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary btn-lg w-full whitespace-normal text-center">
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Enviando…
                  </>
                ) : (
                  <>
                    Enviar instrucciones <ArrowRight className="size-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm">
              <Link to="/login" className="inline-flex min-h-11 items-center font-semibold text-iris hover:underline">
                Volver al login
              </Link>
            </p>
          </>
        )}
      </AuthLayout>
    </>
  );
}
