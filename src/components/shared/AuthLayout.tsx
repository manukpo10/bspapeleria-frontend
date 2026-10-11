import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  description: string;
  /** The form. The card around it is provided here */
  children: ReactNode;
  /** Short handwritten line on the photo panel */
  phrase: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    /** Classes for the crop, for example 'object-right' */
    className?: string;
  };
}

/** Shared frame for the login, register and password recovery pages: form card plus a photo panel from lg */
export function AuthLayout({ title, description, children, phrase, image }: AuthLayoutProps) {
  return (
    <div className="bg-ribbon-soft">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div className="card mx-auto w-full max-w-lg self-center p-6 sm:p-8 lg:mx-0 lg:max-w-none">
          <h1 className="font-display text-3xl font-bold tracking-tight text-dark">{title}</h1>
          <p className="mt-2 text-dark/75">{description}</p>
          <div className="mt-8">{children}</div>
        </div>

        {/* Decorative panel: on small screens only the form shows */}
        <div className="relative hidden min-h-[32rem] overflow-hidden rounded-[2rem] bg-ribbon shadow-lift lg:block">
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 size-full object-cover ${image.className ?? ''}`}
          />
          <p className="absolute bottom-6 left-6 rounded-full bg-white/90 px-6 py-2 font-script text-3xl text-dark shadow-soft backdrop-blur-sm">
            {phrase}
          </p>
        </div>
      </div>
    </div>
  );
}
