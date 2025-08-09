# Snapzy

Production-ready Instagram-like app scaffold with modern stack.

## Architecture
- Frontend: Next.js (TypeScript), Tailwind CSS, Radix/Headless UI, React Query, Framer Motion, Zustand
- Backend: Node.js + Express + TypeScript (REST, versioned /api/v1), JWT + refresh tokens (httpOnly cookie), bcrypt
- DB: MongoDB + Mongoose (Atlas-ready). Collections: users, posts, comments, messages, notifications, hashtags
- Media: Cloudinary (direct-upload, transformations)
- Realtime: Socket.IO for notifications and DMs
- Optional: Redis cache and BullMQ jobs

## Monorepo layout
```
/snapzy
  apps/
    web/           # Next.js frontend
  services/
    api/           # Express backend
  infrastructure/
    docker-compose.yml
```

## Quick start
1) Backend
```
cd services/api
cp .env.example .env
npm install
npm run dev
```

2) Frontend
```
cd apps/web
cp .env.local.example .env.local
npm install
npm run dev
```

## .env (backend)
See `services/api/.env.example`.

## Key endpoints
- Auth: POST /api/v1/auth/register, /login, /refresh, /logout
- Users: GET /api/v1/users/:id, PATCH /api/v1/users/:id
- Posts: POST /api/v1/posts, GET /api/v1/posts/:id, GET /api/v1/feed
- Upload signing: GET /api/v1/uploads/sign

## Deployment
- Use `infrastructure/docker-compose.yml` for Docker dev/prod
- Host backend on Node host (PM2/Docker), frontend on Vercel, MongoDB Atlas, Cloudinary

## License
MIT