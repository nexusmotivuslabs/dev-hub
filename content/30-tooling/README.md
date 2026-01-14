# 30. Tooling

Development tools and setup instructions for Nexus technology stack.

## Nexus Tech Stack

### Backend: Java (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven or Gradle
- **Java Version**: Java 17+ (LTS)
- **Database**: PostgreSQL
- **API Style**: RESTful APIs
- **ORM**: JPA/Hibernate (or Prisma for Node.js projects)

### Frontend: React + Vite
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context or Zustand
- **HTTP Client**: Axios or Fetch API

### Full-Stack: Next.js
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (with BFF pattern)

### Database: PostgreSQL
- **Version**: PostgreSQL 15+
- **ORM Options**: 
  - Prisma (for Node.js/TypeScript projects)
  - JPA/Hibernate (for Java/Spring Boot projects)

### Cloud & Deployment
- **Frontend**: Vercel (with BFF - Backend for Frontend pattern)
- **Full-Scale Apps**: AWS (EC2, RDS, S3, CloudFront, etc.)
- **Authentication**: Google OAuth

## Local Setup

### Prerequisites

**Backend (Java/Spring Boot)**
- Java 17+ (JDK)
- Maven 3.8+ or Gradle 7+
- PostgreSQL 15+ (or Docker for local DB)
- IDE: IntelliJ IDEA (recommended) or VS Code

**Frontend (React/Vite)**
- Node.js 18+ and npm
- Git
- IDE: VS Code (recommended) or IntelliJ IDEA

**Full-Stack (Next.js)**
- Node.js 18+ and npm
- PostgreSQL 15+ (or Docker)
- IDE: VS Code (recommended)

**Shared**
- Docker (for local services)
- Git

### Backend Setup (Java/Spring Boot)

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>/backend

# Install dependencies (Maven)
mvn clean install

# Or with Gradle
./gradlew build

# Set up environment variables
cp .env.example .env
# Edit .env with your local values:
# - DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# - JWT_SECRET=your-secret-key
# - SERVER_PORT=8080

# Run database migrations
mvn flyway:migrate
# Or: ./gradlew flywayMigrate

# Start development server
mvn spring-boot:run
# Or: ./gradlew bootRun

# Server runs on http://localhost:8080 (default)
```

### Frontend Setup (React/Vite)

```bash
# Navigate to frontend directory
cd <project-directory>/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local values:
# - VITE_API_URL=http://localhost:8080/api
# - VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Start development server
npm run dev

# Server runs on http://localhost:5173 (Vite default)
```

### Full-Stack Setup (Next.js)

```bash
# Navigate to Next.js project directory
cd <project-directory>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your local values:
# - DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# - JWT_SECRET=your-secret-key
# - GOOGLE_CLIENT_ID=your-google-client-id

# Generate Prisma Client (if using Prisma)
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Server runs on http://localhost:3000 (Next.js default)
```

### Full Stack Development

```bash
# Terminal 1: Start backend (Java/Spring Boot)
cd backend
mvn spring-boot:run

# Terminal 2: Start frontend (React/Vite)
cd frontend
npm run dev

# Or for Next.js full-stack:
cd nextjs-app
npm run dev
```

## Test Commands

### Java/Spring Boot
```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=UserServiceTest
```

### React/Vite
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Next.js
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## CI Overview

### Vercel (Frontend/Next.js)
- Automatic deployments on push to main
- Preview deployments for pull requests
- Zero-configuration setup
- Built-in CI/CD

### AWS (Full-Scale Apps)
- GitHub Actions for CI/CD
- Automated testing before deployment
- Staging and production environments
- Infrastructure as Code (Terraform/CloudFormation)

## Related

- [Local Setup Guide](./database.md)
- [Architecture Reference](/40-reference/architecture)
- [Deployment Strategy](/domains/platform-engineering/implementation/deployment-strategy)
