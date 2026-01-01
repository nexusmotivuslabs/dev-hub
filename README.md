# Developer Hub

Centralized knowledge base for development teams working on the Master Money System.

## 🚀 Quick Start

### Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**

   **Option A: Docker PostgreSQL (Recommended)**
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

3. **Set environment variables**

   Create `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/devhub
   JWT_SECRET=dev-secret-change-in-production-min-32-chars-required
   NODE_ENV=development
   
   # Optional: Notion integration
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_notion_database_id
   ```

4. **Run database migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

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

