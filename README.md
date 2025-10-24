# Auto Parts Inventory Management System

A full-stack application for managing auto parts inventory with Next.js 15 and Express.js.

## Features

- 🔐 **Authentication**: JWT-based auth with NextAuth
- 📊 **Dashboard**: Real-time analytics and CRUD operations
- 🔍 **Search & Filter**: Dynamic search and category filtering
- 📱 **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- ⚡ **Performance**: SSR, SSG, and CSR rendering strategies
- 🐳 **Docker**: Fully containerized for easy deployment

## Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- MySQL + Prisma ORM
- Passport.js + JWT
- Zod validation
- Jest testing

### Frontend
- Next.js 15
- TypeScript
- NextAuth
- React Hook Form + Zod
- Tailwind CSS
- Axios

## Quick Start with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Run the Application

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd <project-folder>
```

2. **Start all services**
```bash
# for backend
   cd backend
   docker-compose up --build

# for frontend
   cd frontend
   docker-compose up --build
```
This will:
- Start MySQL database
- Run database migrations
- Seed initial data
- Start backend API on port 5000
- Start frontend on port 3000

3. **Access the application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5000/api
    - MySQL: localhost:3307

4. **Default credentials**
    - Email: `test@example.com`
    - Password: `password123`


## Development Setup

### Backend
```bash
cd backend
npm install
# Update .env with your database credentials
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Update .env.local
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Parts (Public)
- `GET /api/parts` - Get all parts (with pagination, search, filter)
- `GET /api/parts/:id` - Get single part
- `GET /api/parts/categories` - Get all categories

### Parts (Protected)
- `POST /api/parts` - Create new part
- `PUT /api/parts/:id` - Update part
- `DELETE /api/parts/:id` - Delete part
- `GET /api/parts/analytics/overview` - Get analytics

## Project Structure
```
.
├── backend/         # Express.js Backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── middleware/        # Custom middleware
│   │   ├── routes/            # API routes
│   │   └── types/             # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   └── Dockerfile
│
├── frontend/        # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & API client
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript types
│   └── Dockerfile
│
└── docker-compose.yml          # Docker orchestration
```

## Rendering Strategies

- **SSR (Server-Side Rendering)**: Homepage (`/`) - Fetches parts on every request
- **SSG (Static Site Generation)**: Part details (`/parts/[id]`) - Pre-generated at build time
- **CSR (Client-Side Rendering)**: Dashboard (`/dashboard`) - Dynamic client-side data fetching

## Testing

### Backend Tests
```bash
cd backend
npm test
```

## Production Deployment

1. Update environment variables for production
2. Use strong secrets for JWT and NextAuth
3. Configure proper CORS settings
4. Set up SSL/TLS certificates
5. Use a reverse proxy (Nginx)
6. Enable rate limiting
7. Set up monitoring and logging