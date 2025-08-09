# Snapzy

Snapzy is a production-ready, Instagram-like social app featuring photo/video sharing, stories, reels, direct messages, notifications, and more. Built with Next.js, TypeScript, Tailwind CSS, Express, MongoDB, Socket.IO, and Cloudinary.

## Tech Stack
- Frontend: Next.js (App Router) + TypeScript, Tailwind CSS, Radix UI, Framer Motion, Zustand, React Query
- Backend: Node.js + Express + TypeScript, Mongoose (MongoDB), JWT + Refresh Tokens, Socket.IO
- Media: Cloudinary (upload + optimization)
- Optional: Redis cache, Docker, CI/CD

## Features
- Auth: Register, Login, Refresh, Forgot/Reset Password
- Profiles: Avatar, bio, posts, followers/following
- Feed: Infinite scroll feed from followed users
- Posts: Photo/Video upload, captions, tags, location
- Likes & Comments: Real-time likes and threaded comments
- Stories: 24h ephemeral stories
- Reels: Short-form video upload & playback
- Search: Users, hashtags, locations
- Follow/Unfollow + Suggestions
- Messages: Realtime 1:1 chat with media
- Notifications: Likes, comments, follows, messages
- Explore: Discover trending content

## Monorepo Structure
```
/ (root)
  apps/
    backend/    # Express + TS API server
    frontend/   # Next.js + TS client
  docker-compose.yml
```

## Quick Start (Local)
1. Prereqs: Node 18+, npm 9+, Docker (optional), MongoDB (or use Docker), Cloudinary account
2. Clone and configure env files:
   - Copy `apps/backend/.env.example` to `apps/backend/.env`
   - Copy `apps/frontend/.env.example` to `apps/frontend/.env`
3. Start services:
   - With Docker: `docker compose up --build`
   - Without Docker:
     - Start MongoDB and Redis locally
     - In one terminal: `npm run -w apps/backend dev`
     - In another: `npm run -w apps/frontend dev`

Backend runs at `http://localhost:4000`.
Frontend runs at `http://localhost:3000`.

## Seeding Demo Data
```
cd apps/backend
npm run seed
```

## Deployment
- Provide environment variables as in `.env.example`
- Build images using Dockerfiles or deploy frontend (Next.js) to Vercel and backend to your Node host
- Ensure CORS and domain names are configured

## Security
- Helmet, CORS, rate limiting
- bcrypt for password hashing
- JWT access + refresh tokens (httpOnly cookie)

## License
MIT