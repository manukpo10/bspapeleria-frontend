import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEO } from '../components/shared/SEO';
import { AuthLayout } from '../components/shared/AuthLayout';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const labelClass = 'block text-sm font-medium text-dark';
const iconClass = 'pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dark/55';
const errorClass = 'mt-1.5 text-xs text-rose-700';

export default function RegisterPage() {
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
      const user = await authApi.register({ name: data.name, email: data.email, password: data.password });
      login(user);
      toast.success('¡Registro exitoso! Bienvenida a BS Papelería');
      navigate('/');
    } catch (err) {
      toast.error((err as Error).message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Registro" />
      <AuthLayout
        title="Crear cuenta"
        description="Unite a nuestra comunidad creativa"
        phrase="Tu próxima idea empieza acá"
        image={{
          src: '/images/brand/home1.webp',
          width: 1500,
          height: 1000,
          alt: 'Agenda lila de tapa dura con lapiceras, una taza y tarjetas con frases sobre una mesa de tonos suaves',
          className: 'object-[38%_50%]',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="register-name" className={labelClass}>Nombre completo</label>
            <div className="relative mt-1.5">
              <User className={iconClass} aria-hidden="true" />
              <input
                {...register('name')}
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'register-name-error' : undefined}
                className="field pl-12"
              />
            </div>
            {errors.name && (
              <p id="register-name-error" role="alert" className={errorClass}>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="register-email" className={labelClass}>Email</label>
            <div className="relative mt-1.5">
              <Mail className={iconClass} aria-hidden="true" />
              <input
                {...register('email')}
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
                className="field pl-12"
              />
            </div>
            {errors.email && (
              <p id="register-email-error" role="alert" className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="register-password" className={labelClass}>Contraseña</label>
            <div className="relative mt-1.5">
              <Lock className={iconClass} aria-hidden="true" />
              <input
                {...register('password')}
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
                className="field pl-12 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-dark/65 transition-colors hover:bg-sand/40 hover:text-dark"
              >
                {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p id="register-password-error" role="alert" className={errorClass}>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="register-confirm-password" className={labelClass}>Confirmar contraseña</label>
            <div className="relative mt-1.5">
              <Lock className={iconClass} aria-hidden="true" />
              <input
                {...register('confirmPassword')}
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={errors.confirmPassword ? true : undefined}
                aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
                className="field pl-12"
              />
            </div>
            {errors.confirmPassword && (
              <p id="register-confirm-password-error" role="alert" className={errorClass}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} aria-busy={loading} className="btn btn-primary btn-lg w-full">
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Creando cuenta…
              </>
            ) : (
              <>
                Crear cuenta <ArrowRight className="size-5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-dark/75">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="inline-flex min-h-11 items-center font-semibold text-iris hover:underline">
            Ingresá
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
