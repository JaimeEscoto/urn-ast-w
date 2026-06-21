# RunnersHub - Red Social para Corredores

Red social para runners con perfil, logros/medallas, validación comunitaria de actividades y eventos de clubes.

## Estructura

- **frontend/** — React + Vite (deploy en Render como Static Site)
- **backend/** — Node.js + Express API (deploy en Render como Web Service)
- **database/** — Schema SQL para Neon (PostgreSQL)

## Funcionalidades clave

1. **Perfil y Logros** — Estadísticas del corredor y medallas (5K Finisher, Runner Consistente, etc.)
2. **Validación Comunitaria** — Otros usuarios validan actividades subidas antes de otorgar medallas
3. **Eventos del Club** — Feed centralizado de carreras y entrenamientos grupales

## Deploy

### Neon (DB)
1. Crear proyecto en https://neon.tech
2. Ejecutar `database/schema.sql` en el SQL Editor
3. Copiar el connection string

### Render (Backend)
- New Web Service → conectar repo → root dir `backend/`
- Build: `npm install` · Start: `npm start`
- Env var: `DATABASE_URL` (de Neon), `JWT_SECRET`

### Render (Frontend)
- New Static Site → root dir `frontend/`
- Build: `npm install && npm run build` · Publish dir: `dist`
- Env var: `VITE_API_URL` (URL del backend)
