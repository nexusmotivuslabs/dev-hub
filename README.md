# Developer Hub

Centralized knowledge base for development teams working on the Master Money System.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: 15.x or higher (or Docker)

### Development Setup

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd dev-hub
   npm install
   ```

2. **Set up database**

   **Option A: Docker PostgreSQL (Recommended for local dev)**
   ```bash
   docker run -d \
     --name dev-hub-postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=devhub \
     -p 5432:5432 \
     postgres:15
   ```

   **Option B: Local PostgreSQL**
   ```bash
   createdb devhub
   ```

3. **Configure environment**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `NODE_ENV=development`

4. **Initialize database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Common Issues

**Issue**: `PrismaClientConstructorValidationError` during build
- **Solution**: Ensure `DATABASE_URL` is set in `.env.local` (even a dummy URL works for build)

**Issue**: Database connection errors
- **Solution**: Verify PostgreSQL is running and `DATABASE_URL` is correct

**Issue**: Port 3000 already in use
- **Solution**: Change port in `package.json` or kill the process using port 3000

### Production Build

```bash
# Generate Prisma Client and build
npm run build

# Start production server
npm start
```

## ☁️ Deployment

### Vercel (Recommended)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment guide.

**Quick Steps:**

1. Push code to GitHub
2. Create Vercel Postgres database in Vercel Dashboard
3. Import project on [Vercel](https://vercel.com)
4. Add environment variables:
   - `DATABASE_URL` (from Vercel Postgres: use `POSTGRES_PRISMA_URL`)
   - `JWT_SECRET` (generate with: `openssl rand -base64 32`)
   - `NOTION_API_KEY` (optional)
   - `NOTION_DATABASE_ID` (optional)
5. Run migrations: `npm run db:migrate:deploy`
6. Deploy automatically

**Important Notes:**
- ⚠️ **Database required**: This project uses PostgreSQL (Prisma) - not JSON files
- Works with Vercel Postgres, AWS RDS, Supabase, or any PostgreSQL provider
- Only the `DATABASE_URL` connection string changes between providers

## 📁 Project Structure

```
dev-hub/
├── app/              # Next.js app router
│   ├── api/         # API routes
│   └── [...slug]/   # Dynamic content pages
├── components/      # React components
├── content/        # Markdown content files
│   ├── domains/    # Domain-specific documentation
│   └── ...         # Other content
├── lib/            # Utilities and helpers
└── public/         # Static assets
```

## 📚 Content Management

Content is stored as Markdown files in the `content/` directory. The app automatically renders these as pages.

### Adding New Content

1. Create a Markdown file in `content/`
2. Use frontmatter for metadata:
   ```markdown
   ---
   title: "Page Title"
   description: "Page description"
   ---
   
   # Content here
   ```
3. The page will be automatically available at `/path/to/file`

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Content**: Markdown with MDX support
- **Deployment**: Vercel (or any platform supporting Next.js)

## 📊 Database

This project uses **Prisma** with **PostgreSQL**, making it compatible with:

- ✅ **Vercel Postgres** (Recommended for Vercel)
- ✅ **AWS RDS PostgreSQL**
- ✅ **Supabase**
- ✅ **Railway**
- ✅ **Local PostgreSQL** (for development)

The same codebase works with any PostgreSQL provider - just change the `DATABASE_URL` connection string.

### Database Scripts

```bash
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Create and apply migrations (dev)
npm run db:migrate:deploy # Apply migrations (production)
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:push          # Push schema changes (dev only)
```

## 📝 License

This project is for educational purposes.

