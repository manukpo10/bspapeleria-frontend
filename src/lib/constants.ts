export const APP_NAME = 'BS Papelería';
export const APP_DESCRIPTION = 'Papelería boutique moderna con productos personalizados, sublimables, archivos digitales y cursos creativos.';
export const APP_URL = 'https://bspapeleria.com';
export const CONTACT_EMAIL = 'hola@bspapeleria.com';

// The shop's WhatsApp line, which is also the phone number shown on the site
export const PHONE_DISPLAY = '+54 9 2213 18-0884';
export const PHONE_HREF = 'tel:+5492213180884';
export const WHATSAPP_URL = 'https://wa.me/5492213180884';

// Backend origin without the /api suffix (the older VITE_API_URL variable included it, so it is not reused)
export const API_URL = (import.meta.env.VITE_BACKEND_URL || 'https://bspapeleria-backend-m8u8.onrender.com').replace(/\/+$/, '');

export const PRODUCT_CATEGORIES = [
  { id: 'personalizados', name: 'Productos Personalizados', description: 'Agendas, tazas, llaveros y más con tu toque personal.' },
  { id: 'sublimables', name: 'Productos Sublimables', description: 'Remeras, mates y accesorios con sublimación de calidad.' },
  { id: 'fiestas', name: 'Detalles para Fiestas', description: 'Cotillón, decoración y todo lo que necesitás para tu evento.' },
  { id: 'carteleria', name: 'Cartelería', description: 'Carteles, invitaciones y papelería para eventos especiales.' },
  { id: 'archivos-digitales', name: 'Archivos Digitales', description: 'Imprimibles, plantillas y recursos descargables.' },
] as const;

export const COURSE_LEVELS = ['principiante', 'intermedio', 'avanzado'] as const;
export const COURSE_MODALITIES = ['online', 'presencial', 'hibrido'] as const;

export const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;
export const PAYMENT_STATUSES = ['pending', 'approved', 'rejected'] as const;

export const NOTIFICATION_TYPES = ['order', 'course', 'announcement', 'system'] as const;

export const FAQ_CATEGORIES = ['envios', 'pagos', 'cursos', 'devoluciones', 'personalizados'] as const;
