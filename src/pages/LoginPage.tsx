import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '../components/shared/SEO';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = await api.login(data.email, data.password);
      login(user);
      toast.success(`¡Bienvenida de vuelta, ${user.name}!`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Ingresar" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl bg-white border border-sand/50 shadow-soft p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-semibold text-dark mb-2">Bienvenida de vuelta</h1>
              <p className="text-sm text-dark/60">Ingresá a tu cuenta para continuar</p>
            </div>

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

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-sand bg-white pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-dark/60 cursor-pointer">
                  <input type="checkbox" className="rounded border-sand text-primary focus:ring-primary" />
                  Recordarme
                </label>
                <Link to="/recuperar-password" className="text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
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
                    Ingresar <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-dark/60">
              ¿No tenés cuenta?{' '}
              <Link to="/registro" className="text-primary font-medium hover:underline">Registrate</Link>
            </div>

            <div className="mt-6 pt-6 border-t border-sand/50 text-xs text-dark/40 text-center">
              <p>Admin: admin@bspapeleria.com / admin123</p>
              <p>Usuario: usuario@test.com / user123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
