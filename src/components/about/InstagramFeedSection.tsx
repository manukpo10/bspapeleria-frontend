import { Heart, MessageCircle } from 'lucide-react';

/* TODO: reemplazar mocks por integración real con Instagram Graph API
   o widget de LightWidget/SnapWidget cuando se conecte la cuenta. */

const InstagramIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const mockPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 234,
    comments: 18,
    url: 'https://instagram.com/bspapeleria',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 189,
    comments: 12,
    url: 'https://instagram.com/bspapeleria',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 312,
    comments: 24,
    url: 'https://instagram.com/bspapeleria',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 156,
    comments: 9,
    url: 'https://instagram.com/bspapeleria',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 278,
    comments: 21,
    url: 'https://instagram.com/bspapeleria',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?auto=format&fit=crop&w=400&h=400&q=80',
    likes: 145,
    comments: 7,
    url: 'https://instagram.com/bspapeleria',
  },
];

export function InstagramFeedSection() {
  return (
    <section aria-labelledby="instagram-heading" className="bg-mist py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">Últimas publicaciones</p>
          <h2 id="instagram-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            En nuestro Instagram
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {mockPosts.map((post) => (
            <li key={post.id}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver la publicación ${post.id} en Instagram (se abre en una pestaña nueva)`}
                className="group relative block aspect-square overflow-hidden rounded-3xl bg-sand/40 shadow-soft"
              >
                <img
                  src={post.image}
                  alt={`Publicación ${post.id}`}
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-dark/65 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <InstagramIcon className="size-8" />
                  <span className="flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Heart className="size-4 fill-white" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="size-4 fill-white" /> {post.comments}
                    </span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            href="https://instagram.com/bspapeleria"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <InstagramIcon className="size-5" /> Ver más en Instagram
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
