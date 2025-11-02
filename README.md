# Resiliencia Climática Urbana — Soacha (RCU)

Proyecto scaffold con Vite + React 18 + TypeScript, TailwindCSS y librerías requeridas.

Stack incluido:
- React 18 + TypeScript (Vite)
- Tailwind CSS
- Radix NavigationMenu (integrado estilo shadcn-like)
- Supabase (placeholder para variables de entorno)
- Leaflet (react-leaflet)
- React Hook Form + Zod
- TanStack Query
- Recharts

Instrucciones rápidas:

1) Instalar dependencias:

```bash
npm install
```

2) Ejecutar en modo desarrollo:

```bash
npm run dev
```

3) Variables de entorno: copiar `.env.example` a `.env` y rellenar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

Notas:
- El logo placeholder está en `public/logo.png`. Reemplázalo por el PNG oficial si lo tienes.
- Para integrar `shadcn` CLI (opcional) ejecutar localmente: `npx shadcn@latest add navigation-menu` si quieres regenerar componentes.
- Se añadieron assets de marcador para Leaflet en `src/assets`.

Accesibilidad:
- Menú hamburguesa con `aria-expanded`.
- Foco visible en elementos interactivos.
