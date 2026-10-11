import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '../components/shared/SEO';
import { AuthLayout } from '../components/shared/AuthLayout';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

type FormData = z.infer<typeof schema>;

const labelClass = 'block text-sm font-medium text-dark';
const iconClass = 'pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dark/55';
const errorClass = 'mt-1.5 text-xs text-rose-700';

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
      const user = await authApi.login(data.email, data.password);
      login(user);
      toast.success(`¡Bienvenida de vuelta, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin/overview' : '/');
    } catch (err) {
      toast.error((err as Error).message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Ingresar" />
      <AuthLayout
        title="Bienvenida de vuelta"
        description="Ingresá a tu cuenta para continuar"
        phrase="Qué bueno verte de nuevo"
        image={{
          src: '/images/home/hecho-a-mano.webp',
          width: 1024,
          height: 1280,
          alt: 'Manos atando un moño de cinta lila sobre una libreta lavanda, junto a lapiceras color cobre y estrellitas de papel',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="login-email" className={labelClass}>Email</label>
            <div className="relative mt-1.5">
              <Mail className={iconClass} aria-hidden="true" />
              <input
                {...register('email')}
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
                className="field pl-12"
              />
            </div>
            {errors.email && (
              <p id="login-email-error" role="alert" className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className={labelClass}>Contraseña</label>
            <div className="relative mt-1.5">
              <Lock className={iconClass} aria-hidden="true" />
              <input
                {...register('password')}
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                className="field pl-12 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-dark/65 transition-colors hover:bg-sand/40 hover:text-dark"
              >
                {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" role="alert" className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-dark/75">
              <input type="checkbox" className="size-5 rounded accent-iris" />
              Recordarme
            </label>
            <Link
              to="/recuperar-password"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-iris hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary btn-lg w-full">
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Ingresando…
              </>
            ) : (
              <>
                Ingresar <ArrowRight className="size-5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark/75">
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="inline-flex min-h-11 items-center font-semibold text-iris hover:underline">
            Registrate
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
