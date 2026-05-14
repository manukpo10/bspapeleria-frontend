import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';

/* TODO: reemplazar mocks por integración real con Instagram Graph API
   o widget de LightWidget/SnapWidget cuando se conecte la cuenta. */

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
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
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="block font-script text-2xl text-secondary mb-2">últimas publicaciones</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark mb-4">
            En nuestro Instagram
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mockPosts.map((post, i) => (
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden"
            >
              <img
                src={post.image}
                alt={`Publicación ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <InstagramIcon />
                <div className="flex items-center gap-4 text-white text-sm font-medium">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-white" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-white" /> {post.comments}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/bspapeleria"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-sand px-6 py-3 text-sm font-medium text-dark hover:bg-sand/30 hover:border-primary/30 transition-colors"
          >
            <InstagramIcon /> Ver más en Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
