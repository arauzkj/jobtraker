<p align="center">
  <img src="public/logo.png" alt="JobTracker logo" width="120" />
</p>

<h1 align="center">JobTracker</h1>

Proyecto personal para organizar y dar seguimiento a solicitudes de empleo: estados, etapas del proceso, notas y línea de tiempo por vacante, todo desde un panel centralizado.

## Tecnologías

| Área | Stack |
|------|-------|
| Frontend | Next.js (App Router), React, TypeScript |
| Estilos | Tailwind CSS, shadcn/ui |
| Backend | API Routes de Next.js |
| Base de datos | CockroachDB + Prisma ORM |
| Autenticación | Better Auth |
| IA (opcional) | OpenRouter — extracción de datos desde enlaces de vacantes |
| Visual | React Three Fiber |

## Requisitos

- Node.js
- pnpm
- Base de datos compatible con PostgreSQL (CockroachDB en este proyecto)

## Configuración

1. Instala dependencias:

```bash
pnpm install
```

2. Crea un archivo `.env` en la raíz con al menos:

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="tu-secreto"
NEXT_PUBLIC_APP_URL="https://tu-dominio.com" # URL pública usada para SEO y enlaces compartidos
OPENROUTER_API_KEY="..."   # opcional, para importar vacantes por URL
```

3. Genera el cliente de Prisma y aplica el esquema:

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev
```

4. Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Comandos del proyecto

```bash
pnpm dev          # desarrollo (genera Prisma Client y levanta Next.js)
pnpm build        # build de producción
pnpm start        # servidor de producción
pnpm lint         # ESLint
```

## Comandos útiles de Prisma

```bash
pnpm exec prisma generate          # regenerar el cliente tras cambios en el schema
pnpm exec prisma migrate dev       # crear y aplicar migraciones en desarrollo
pnpm exec prisma migrate deploy    # aplicar migraciones en producción
pnpm exec prisma migrate status    # ver estado de migraciones
pnpm exec prisma db push           # sincronizar schema sin crear migración
pnpm exec prisma studio            # explorar y editar datos en el navegador
pnpm exec prisma validate          # validar el schema
pnpm exec prisma format            # formatear archivos .prisma
```

## Estructura (resumen)

```
src/app/          → páginas y rutas API
src/components/   → UI y dashboard
src/services/     → lógica de negocio
src/repositories/ → acceso a datos
prisma/           → modelos y migraciones
```

---

Proyecto de uso personal. No está pensado como producto comercial ni como plantilla de producción lista para desplegar.
