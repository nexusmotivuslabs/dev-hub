# Reusable Architecture Patterns

This document highlights key architectural patterns used in Nexus applications. These patterns represent proven solutions for our technology stack: **Java/Spring Boot, React/Vite, Next.js, PostgreSQL, AWS, and Vercel**.

## Table of Contents

1. [Frontend-Backend Communication](#frontend-backend-communication)
2. [Authentication Flow (Google OAuth)](#authentication-flow-google-oauth)
3. [Protected Routes Pattern](#protected-routes-pattern)
4. [API Request/Response Flow](#api-requestresponse-flow)
5. [Database Connection Pattern](#database-connection-pattern)
6. [Environment Configuration](#environment-configuration)
7. [BFF Pattern (Backend for Frontend)](#bff-pattern-backend-for-frontend)

---

## Frontend-Backend Communication

### Architecture Diagram

```
┌─────────────────┐         HTTP Requests         ┌─────────────────┐
│                 │  ───────────────────────────>  │                 │
│  Vite Dev       │  (fetch, axios calls)          │  Backend        │
│  Server         │                                 │  Server         │
│  (Frontend)     │  <───────────────────────────  │  (API)          │
│  Port 5173      │  (JSON responses)               │  Port 3001      │
│                 │                                 │                 │
└─────────────────┘                                 └─────────────────┘
      │                                                      │
      │                                                      │
      ▼                                                      ▼
  Browser renders                                          Database
  React components                                         (PostgreSQL)
```

### Key Components

**Frontend (Vite Dev Server)**
- **Purpose**: Serves React UI, handles client-side routing
- **Technology**: Vite + React + TypeScript
- **Port**: 5173 (development)
- **Responsibilities**:
  - Render React components
  - Handle user interactions
  - Make API requests to backend
  - Manage client-side state
  - Route management (React Router)

**Backend (Express API Server)**
- **Purpose**: Handles business logic, data processing, database operations
- **Technology**: Express.js + TypeScript + Prisma
- **Port**: 3001 (development)
- **Responsibilities**:
  - Process API requests
  - Validate input data
  - Execute business logic
  - Database queries (Prisma/PostgreSQL)
  - Authentication/authorization
  - Return JSON responses

### Communication Flow

1. **User Action** → Frontend component triggers API call
2. **HTTP Request** → Frontend sends request to `http://localhost:3001/api/...`
3. **Backend Processing** → Express routes handle request, process logic
4. **Database Query** → Prisma queries PostgreSQL database
5. **Response** → Backend returns JSON data
6. **UI Update** → Frontend receives response, updates React state, re-renders

### Implementation Example

**Frontend (React)**
```typescript
// services/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const fetchDashboard = async () => {
  const response = await fetch(`${API_BASE}/api/dashboard`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  return response.json()
}
```

**Backend (Express)**
```typescript
// routes/dashboard.ts
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.userId!
  const dashboard = await getDashboardData(userId)
  res.json(dashboard)
})
```

### When to Use

✅ **Use this pattern when:**
- Building full-stack applications
- Need separation of concerns (UI vs. business logic)
- Multiple clients need to access same API
- Need to scale frontend and backend independently

---

## Authentication Flow

### Architecture Diagram

```
┌──────────────┐
│   Browser    │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────┐
│  Backend API    │
│  /api/auth/login│
└──────┬──────────┘
       │
       │ 2. Validate credentials
       │    Hash password (bcrypt)
       │    Query database
       ▼
┌─────────────────┐
│   Database      │
│   (PostgreSQL)  │
└──────┬──────────┘
       │
       │ 3. User found/not found
       ▼
┌─────────────────┐
│  Backend API    │
│  Generate JWT   │
└──────┬──────────┘
       │
       │ 4. Return { token, user }
       ▼
┌──────────────┐
│   Browser    │
│  Store token │
│  in localStorage
└──────────────┘
```

### Key Components

**Authentication Endpoints**
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/user/profile` - Get authenticated user profile

**Token Management**
- **JWT (JSON Web Token)**: Stateless authentication
- **Storage**: `localStorage` (client-side)
- **Validation**: Backend verifies token on each request
- **Expiration**: Configurable (default: 7 days)

### Implementation Example

**Backend Authentication**
```typescript
// routes/auth.ts
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // Find user
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  
  // Verify password
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  
  // Generate JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })
  
  res.json({ token, user: { id: user.id, email: user.email } })
})
```

**Frontend Authentication**
```typescript
// services/api.ts
export const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  if (!response.ok) throw new Error('Login failed')
  
  const { token, user } = await response.json()
  localStorage.setItem('token', token)
  return { token, user }
}
```

### When to Use

✅ **Use this pattern when:**
- Building user-facing applications
- Need secure user authentication
- Want stateless authentication (JWT)
- Need to support multiple auth providers (email, OAuth)

---

## Protected Routes Pattern

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│         User Requests Route             │
│         /dashboard, /settings, etc.      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      ProtectedRoute Component           │
│      (Client-side guard)                │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐  ┌─────────────┐
│ Has Token?  │  │ No Token    │
│ & Valid?    │  │             │
└──────┬──────┘  └──────┬──────┘
       │                │
       │                │ Redirect to /login
       │                ▼
       │         ┌─────────────┐
       │         │  Login Page │
       │         └─────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Validate Token with Backend            │
│  GET /api/dashboard (with token)        │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐  ┌─────────────┐
│ Valid Token │  │ Invalid     │
│             │  │ Token       │
└──────┬──────┘  └──────┬──────┘
       │                │
       │                │ Remove token
       │                │ Redirect to /login
       │                ▼
       │         ┌─────────────┐
       │         │  Login Page │
       │         └─────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Render Protected Content               │
│  (Dashboard, Settings, etc.)            │
└─────────────────────────────────────────┘
```

### Key Components

**ProtectedRoute Component**
- Wraps routes that require authentication
- Checks for token in `localStorage`
- Validates token with backend API
- Redirects to login if not authenticated

**PublicRoute Component**
- Wraps routes accessible to unauthenticated users
- Redirects authenticated users away (e.g., landing page → dashboard)

### Implementation Example

**ProtectedRoute Component**
```typescript
// components/ProtectedRoute.tsx
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { dashboard, isDemo, fetchDashboard } = useGameStore()
  const token = localStorage.getItem('token')
  
  useEffect(() => {
    if (token && !dashboard) {
      fetchDashboard() // Validates token
    }
  }, [token, dashboard])
  
  if (!token || isDemo) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
```

**Usage in Routes**
```typescript
// App.tsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
</Routes>
```

### When to Use

✅ **Use this pattern when:**
- Need to protect certain routes from unauthenticated access
- Want client-side route protection (faster UX)
- Need to validate authentication before rendering content
- Building multi-page applications with authentication

---

## API Request/Response Flow

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Request                            │
│  fetch('/api/users', {                                       │
│    method: 'GET',                                            │
│    headers: { 'Authorization': 'Bearer token' }             │
│  })                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Middleware Stack                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. CORS Middleware                                  │    │
│  │    - Allow cross-origin requests                    │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 2. Body Parser                                      │    │
│  │    - Parse JSON body                                │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 3. Authentication Middleware                         │    │
│  │    - Verify JWT token                               │    │
│  │    - Extract userId                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 4. Route Handler                                    │    │
│  │    - Execute business logic                         │    │
│  │    - Query database                                 │    │
│  │    - Return response                                │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Query                           │
│  await prisma.user.findUnique({                             │
│    where: { id: userId }                                    │
│  })                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    JSON Response                            │
│  {                                                           │
│    "id": "user-id",                                          │
│    "email": "user@example.com",                             │
│    "firstName": "John"                                       │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

**Middleware Stack**
1. **CORS** - Handle cross-origin requests
2. **Body Parser** - Parse request body (JSON)
3. **Authentication** - Verify JWT tokens
4. **Route Handler** - Execute business logic

**Error Handling**
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

### Implementation Example

**Middleware Chain**
```typescript
// index.ts
app.use(cors())
app.use(express.json())

// Protected route
app.use('/api/dashboard', authenticateToken)
app.get('/api/dashboard', async (req: AuthRequest, res) => {
  const userId = req.userId! // Set by authenticateToken middleware
  const data = await getDashboardData(userId)
  res.json(data)
})
```

**Authentication Middleware**
```typescript
// middleware/auth.ts
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    (req as AuthRequest).userId = (decoded as any).userId
    next()
  })
}
```

### When to Use

✅ **Use this pattern when:**
- Building RESTful APIs
- Need consistent request/response handling
- Want reusable authentication logic
- Need centralized error handling

---

## Database Connection Pattern

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (Express Routes, Services)                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Prisma Client
                       │ (ORM)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Prisma Client                            │
│  - Type-safe queries                                        │
│  - Connection pooling                                       │
│  - Query optimization                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ SQL Queries
                       │ (via connection pool)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│  - Tables: User, Post, Comment, etc.                       │
│  - Relationships: Foreign keys, joins                       │
│  - Indexes: Performance optimization                       │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

**Prisma Client**
- Type-safe database access
- Connection pooling
- Query builder
- Migration management

**Connection String**
- Format: `postgresql://user:password@host:port/database`
- Environment variable: `DATABASE_URL`
- Supports connection pooling

### Implementation Example

**Prisma Setup**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

export { prisma }
```

**Database Queries**
```typescript
// routes/user.ts
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.userId!
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      username: true,
    }
  })
  
  res.json(user)
})
```

### When to Use

✅ **Use this pattern when:**
- Need type-safe database access
- Want to avoid raw SQL queries
- Need database migrations
- Building applications with complex data relationships

---

## Environment Configuration

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application                               │
│  (Next.js / Express / React)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Reads environment variables
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Environment Variables                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Development (.env.local)                            │    │
│  │ DATABASE_URL=postgresql://localhost:5432/dev       │    │
│  │ JWT_SECRET=dev-secret-key                           │    │
│  │ NODE_ENV=development                                │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Production (Vercel Environment Variables)           │    │
│  │ DATABASE_URL=$POSTGRES_PRISMA_URL                   │    │
│  │ JWT_SECRET=production-secret-key                    │    │
│  │ NODE_ENV=production                                 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

**Environment Files**
- `.env.local` - Local development (gitignored)
- `.env.example` - Template for required variables
- Vercel Environment Variables - Production configuration

**Variable Types**
- **Secrets**: JWT_SECRET, API keys (never commit)
- **Configuration**: DATABASE_URL, API_URL (environment-specific)
- **Feature Flags**: ENABLE_FEATURE_X (boolean flags)

### Implementation Example

**Environment Setup**
```typescript
// Backend
const DATABASE_URL = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}
```

**Frontend (Vite)**
```typescript
// Frontend - only VITE_ prefixed vars are exposed
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
```

**Vercel Configuration**
```json
// vercel.json
{
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

### When to Use

✅ **Use this pattern when:**
- Need different configurations per environment
- Want to keep secrets out of code
- Need to configure external services (databases, APIs)
- Deploying to multiple environments (dev, staging, prod)

---

## BFF Pattern (Backend for Frontend)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                         │
│  Next.js App Router                                          │
│  - React Components                                          │
│  - API Routes (BFF Layer)                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ API Routes (/api/*)
                       │ Server-side only
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (BFF)                        │
│  - Aggregates data from multiple sources                    │
│  - Transforms data for frontend needs                        │
│  - Handles authentication                                    │
│  - Optimizes for frontend requirements                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Requests
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Services                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Java/Spring Boot API                                │    │
│  │ - Business logic                                    │    │
│  │ - Database operations                               │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ External APIs                                       │    │
│  │ - Third-party services                              │    │
│  │ - Microservices                                     │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

**BFF (Backend for Frontend)**
- **Purpose**: Optimize API for specific frontend needs
- **Location**: Next.js API routes (`/app/api/*`)
- **Benefits**:
  - Reduces frontend complexity
  - Aggregates multiple backend calls
  - Transforms data for UI needs
  - Handles authentication/authorization
  - Caches responses when appropriate

**Backend Services**
- **Java/Spring Boot**: Main business logic and database operations
- **External APIs**: Third-party services, microservices

### Implementation Example

**Next.js API Route (BFF)**
```typescript
// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Authenticate user
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Aggregate data from multiple sources
  const [userData, stats, notifications] = await Promise.all([
    fetch('https://api.backend.com/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch('https://api.backend.com/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch('https://api.backend.com/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
  ])

  // Transform data for frontend
  const dashboard = {
    user: await userData.json(),
    stats: await stats.json(),
    notifications: await notifications.json(),
    // Add computed fields
    unreadCount: (await notifications.json()).filter(n => !n.read).length
  }

  return NextResponse.json(dashboard)
}
```

**Frontend Usage**
```typescript
// components/Dashboard.tsx
const Dashboard = () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(setData)
  }, [])

  return <div>{/* Render dashboard */}</div>
}
```

### When to Use

✅ **Use BFF pattern when:**
- Deploying frontend to Vercel
- Need to aggregate data from multiple backend services
- Want to optimize API responses for specific frontend needs
- Need to handle authentication/authorization at edge
- Want to reduce frontend complexity

## Summary

These architectural patterns provide reusable solutions for Nexus technology stack:

1. **Frontend-Backend Communication** - React/Vite ↔ Java/Spring Boot via HTTP+JSON
2. **Authentication Flow** - Google OAuth with JWT tokens
3. **Protected Routes** - Client-side route protection
4. **API Request/Response** - Consistent API handling with middleware
5. **Database Connection** - PostgreSQL with Prisma (Node.js) or JPA/Hibernate (Java)
6. **Environment Configuration** - Environment-specific configuration management
7. **BFF Pattern** - Next.js API routes for Vercel deployments

Each pattern is tailored to our technology stack and can be reused across Nexus applications while maintaining best practices and security standards.
