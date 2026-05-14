# BS Papelería - Frontend

Frontend completo de e-commerce + plataforma de cursos (LMS) para BS Papelería.

## Stack Técnico

- React 18 + Vite + TypeScript
- Tailwind CSS con paleta custom
- React Router v6
- Zustand (persist en localStorage)
- React Hook Form + Zod
- Framer Motion
- Lucide React
- Swiper.js
- Sonner (toasts)
- react-helmet-async (SEO)

## Instalación

```bash
npm install
npm run dev
```

## Credenciales Mock

- Admin: `admin@bspapeleria.com` / `admin123`
- Usuario: `usuario@test.com` / `user123`

## Estructura

```
src/
├── components/    (UI, layouts, secciones)
├── pages/         (Todas las páginas)
├── store/         (Zustand stores)
├── services/      (Capa API mockeada)
├── data/          (Mocks JSON/TS)
├── types/         (TypeScript types)
├── lib/           (Utils, constants)
├── routes/        (Rutas protegidas)
```

## Notas de Integración Backend

Todas las funciones en `src/services/api.ts` tienen un comentario `// TODO: reemplazar por fetch real`. La capa está diseñada para que el reemplazo por llamadas HTTP reales sea trivial.

## Características

- Home completa con sliders Swiper
- Listado de productos con filtros, búsqueda, paginación
- Detalle de producto con galería y tabs
- Listado de cursos con filtros
- Sales page de curso con temario acordeón
- Aula virtual (LMS) con video, quiz, asignaciones, notas
- Carrito y checkout multi-step
- Auth (login, registro, recuperar contraseña)
- Dashboard de usuario (cursos, pedidos, wishlist, perfil, direcciones, notificaciones)
- Panel de admin (stats, CRUD productos/cursos/pedidos/usuarios/cupones, course builder)
- SEO con react-helmet-async
- Sistema de toasts integrado
- Diseño responsive mobile-first
- Paleta de colores pastel sofisticada
- Animaciones con Framer Motion
