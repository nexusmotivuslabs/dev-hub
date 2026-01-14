# Developer Onboarding Guide

Welcome to the Developer Hub! This guide will help you get set up and start contributing quickly.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### 2. Clone and Install
```bash
git clone <repository-url>
cd dev-hub
npm install
```

### 3. Database Setup

**Option A: Docker (Recommended)**
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

### 4. Environment Configuration
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/devhub
JWT_SECRET=$(openssl rand -base64 32)  # Generate a secure secret
NODE_ENV=development
```

### 5. Initialize Database
```bash
npm run db:generate
npm run db:migrate
```

### 6. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
dev-hub/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── [...slug]/         # Dynamic content pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Navigation.tsx     # Top navigation
│   ├── Sidebar.tsx        # Sidebar navigation
│   ├── SearchModal.tsx    # Search functionality
│   └── ...
├── content/              # Markdown content
│   ├── domains/          # Domain-specific docs
│   └── ...
├── lib/                  # Utilities
│   ├── auth.ts           # Authentication
│   ├── prisma.ts         # Database client
│   └── search.ts         # Search functionality
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── tests/                # Test files
```

---

## 🛠️ Development Workflow

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Write tests for new features
   - Update documentation

3. **Test locally**
   ```bash
   npm run lint      # Check code quality
   npm test          # Run tests
   npm run dev       # Test in browser
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

### Adding New Content

1. Create a Markdown file in `content/`
2. Use frontmatter for metadata:
   ```markdown
   ---
   title: "Page Title"
   description: "Page description"
   ---
   
   # Your content here
   ```
3. The page will be available at `/path/to/file`

### Adding New Components

1. Create component in `components/`
2. Use TypeScript
3. Follow existing component patterns
4. Add accessibility attributes (ARIA labels, keyboard navigation)
5. Make it responsive

---

## 🧪 Testing

### Run Tests
```bash
npm test              # Run all tests
npm test:watch        # Watch mode
npm test:coverage     # With coverage report
```

### Test Coverage Goals
- Unit tests: 70%+ coverage
- Integration tests: Critical paths
- E2E tests: Main user flows

---

## 🐛 Common Issues & Solutions

### Issue: `PrismaClientConstructorValidationError` during build
**Solution**: Ensure `DATABASE_URL` is set in `.env.local`

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in package.json
```

### Issue: Database connection errors
**Solution**: 
- Verify PostgreSQL is running: `docker ps` (if using Docker)
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Test connection: `psql $DATABASE_URL`

### Issue: Module not found errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails with TypeScript errors
**Solution**:
```bash
npm run lint          # See all errors
# Fix errors, then rebuild
npm run build
```

---

## 📚 Key Documentation

- **Principles**: `/00-principles` - Core development principles
- **Contracts**: `/10-developer-contracts` - Developer agreements
- **Workflows**: `/20-workflows` - Development workflows
- **Tooling**: `/30-tooling` - Development tools
- **API Integration**: `/domains/api-integration` - API patterns
- **Nexus Agents**: `/domains/nexus-agents` - Agent system

---

## 🔧 Development Tools

### Database Management
```bash
npm run db:studio     # Open Prisma Studio (database GUI)
npm run db:push       # Push schema changes (dev only)
npm run db:migrate    # Create and apply migrations
```

### Code Quality
```bash
npm run lint          # ESLint
npm test              # Jest tests
```

### Build & Deploy
```bash
npm run build         # Production build
npm start             # Production server
```

---

## 🎯 Getting Help

1. **Check Documentation**: Search the Dev Hub for answers
2. **Review Code**: Look at similar implementations
3. **Ask Questions**: Contact the team
4. **Check Issues**: Look for similar issues in the repository

---

## ✅ Onboarding Checklist

- [ ] Environment set up and running
- [ ] Can access app at http://localhost:3000
- [ ] Can create/edit content
- [ ] Can run tests successfully
- [ ] Understand project structure
- [ ] Read development principles
- [ ] Reviewed developer contracts

---

**Welcome to the team!** 🎉

If you have questions, don't hesitate to ask. The Dev Hub is here to help you be productive.

