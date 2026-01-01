# 30. Tooling

Development tools and setup instructions for our Java backend and React frontend stack.

## Tech Stack

### Backend: Java (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven or Gradle
- **Java Version**: Java 17+ (LTS)
- **Database**: PostgreSQL with Prisma (or JPA/Hibernate)
- **API Style**: RESTful APIs

### Frontend: React
- **Framework**: React 18+
- **Build Tool**: Vite or Create React App
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context or Zustand
- **HTTP Client**: Axios or Fetch API

## Local Setup

### Prerequisites

**Backend (Java)**
- Java 17+ (JDK)
- Maven 3.8+ or Gradle 7+
- PostgreSQL (or Docker for local DB)
- IDE: IntelliJ IDEA (recommended) or VS Code

**Frontend (React)**
- Node.js 18+ and npm
- Git
- IDE: VS Code (recommended) or IntelliJ IDEA

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
# - DATABASE_URL
# - JWT_SECRET
# - SERVER_PORT

# Run database migrations
mvn flyway:migrate
# Or: ./gradlew flywayMigrate

# Start development server
mvn spring-boot:run
# Or: ./gradlew bootRun

# Server runs on http://localhost:8080 (default)
```

### Frontend Setup (React)

```bash
# Navigate to frontend directory
cd <project-directory>/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local values:
# - REACT_APP_API_URL=http://localhost:8080/api
# - REACT_APP_ENV=development

# Start development server
npm start
# Or: npm run dev (if using Vite)

# Server runs on http://localhost:3000 (default)
```

### Full Stack Development

```bash
# Terminal 1: Start backend
cd backend
mvn spring-boot:run

# Terminal 2: Start frontend
cd frontend
npm start

# Backend API: http://localhost:8080/api
# Frontend App: http://localhost:3000
```

## Test Commands

### Backend (Java)

```bash
# Run all tests
mvn test
# Or: ./gradlew test

# Run tests with coverage
mvn test jacoco:report
# Or: ./gradlew test jacocoTestReport

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run integration tests
mvn verify
# Or: ./gradlew integrationTest

# Check code quality
mvn sonar:sonar
```

### Frontend (React)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run E2E tests (Playwright/Cypress)
npm run test:e2e

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking (TypeScript)
npm run type-check
```

## Development Tools

### Backend Tools

**IDE Setup (IntelliJ IDEA)**
- Install Spring Boot plugin
- Configure code style (Google Java Style Guide)
- Enable annotation processing
- Set up run configurations for Spring Boot apps

**Essential Plugins**
- Lombok (reduce boilerplate)
- MapStruct (object mapping)
- Spring Assistant
- SonarLint (code quality)

**Database Tools**
- DBeaver or pgAdmin (PostgreSQL)
- Flyway or Liquibase (migrations)
- Prisma Studio (if using Prisma)

### Frontend Tools

**IDE Setup (VS Code)**
- ESLint extension
- Prettier extension
- React snippets
- Tailwind CSS IntelliSense

**Essential Extensions**
- ESLint
- Prettier
- React Developer Tools (browser)
- Redux DevTools (if using Redux)

## Build Commands

### Backend

```bash
# Build JAR file
mvn clean package
# Output: target/app.jar

# Run JAR
java -jar target/app.jar

# Build Docker image
docker build -t backend:latest .

# Run with Docker
docker run -p 8080:8080 backend:latest
```

### Frontend

```bash
# Production build
npm run build

# Build output in: build/ or dist/

# Preview production build
npm run preview

# Build Docker image
docker build -t frontend:latest .

# Run with Docker
docker run -p 3000:3000 frontend:latest
```

## CI Overview

Our CI pipeline runs on every push and pull request:

1. **Linting**: Check code style and quality
2. **Type Checking**: Verify TypeScript types
3. **Unit Tests**: Run all unit tests
4. **Integration Tests**: Run integration tests
5. **Build**: Verify the project builds
6. **E2E Tests**: Run end-to-end tests (on main branch)

### CI Commands

The CI uses the same commands as local development:

- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build`
- `npm run test:e2e`

## Related

- [Workflows](/20-workflows)
- [Reference](/40-reference)
- [Domains](/domains)

