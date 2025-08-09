# DoorToDoor Multi-Tenant Scaffold

This repository contains a minimal monorepo used for the DoorToDoor canvassing
application.  It provides a baseline Fastify backend, a Next.js web frontend and
an Expo based React Native mobile client.  Each service is located under the
`app` directory.

## Structure

```
/app
  /backend   # Fastify API + PostgreSQL (Cloud Run ready)
  /web       # Next.js web application
  /mobile    # Expo React Native application
```

## Getting Started

### Backend
```bash
cd app/backend
npm install
npm start
```
The API listens on `http://localhost:8080` and exposes `/v1/health`.

### Web
```bash
cd app/web
npm install
npm run dev
```
The site runs on `http://localhost:3000` and checks backend health.

### Mobile
```bash
cd app/mobile
npm install
npm start
```
The Expo app fetches backend health once booted.

## Deployment
A Dockerfile for the backend is included and designed for Google Cloud Run. See
`app/backend/Dockerfile` for details.
