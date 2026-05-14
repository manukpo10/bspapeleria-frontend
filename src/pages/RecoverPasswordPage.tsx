import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '../components/shared/SEO';
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
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Recuperar Contraseña" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl bg-white border border-sand/50 shadow-soft p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-semibold text-dark mb-2">Recuperar contraseña</h1>
              <p className="text-sm text-dark/60">Te enviaremos instrucciones para restablecerla</p>
            </div>

            {sent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <p className="text-dark mb-6">Revisá tu bandeja de entrada. Te enviamos un email con las instrucciones.</p>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-secondary transition-colors">
                  <ArrowRight className="w-4 h-4" /> Volver al login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full rounded-xl border border-sand bg-white pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-glow hover:bg-secondary transition-colors disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Enviar instrucciones <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {!sent && (
              <div className="mt-6 text-center text-sm text-dark/60">
                <Link to="/login" className="text-primary font-medium hover:underline">Volver al login</Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
