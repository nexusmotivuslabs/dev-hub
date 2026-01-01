# Database Notes

Database setup, configuration, and best practices for our Java backend and React frontend stack.

## Database Technology

### Primary Database: PostgreSQL

**Why PostgreSQL?**
- ACID compliant (data consistency)
- High performance with advanced indexing
- Excellent for concurrent operations
- Strong JSON support
- Open source and well-supported
- Works great with both Java (JPA/Hibernate) and Prisma

### Development Database: SQLite (Optional)

For local development, SQLite can be used for simplicity:
- No server setup required
- File-based database
- Easy to reset and test
- Switch to PostgreSQL for staging/production

## Database Setup

### PostgreSQL Installation

**macOS (Homebrew)**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Docker (Recommended)**
```bash
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=devdb \
  -p 5432:5432 \
  -d postgres:15
```

**Connection String Format**
```
postgresql://username:password@localhost:5432/database_name
```

### Database Tools

**Recommended Tools**
- **DBeaver**: Universal database tool (free)
- **pgAdmin**: PostgreSQL-specific admin tool
- **Prisma Studio**: Visual database browser (if using Prisma)
- **IntelliJ Database Tools**: Built-in database support

## Database Access Patterns

### Java Backend (Spring Boot + JPA)

```java
// Entity definition
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String name;
    
    @OneToMany(mappedBy = "user")
    private List<Post> posts;
}

// Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
}

// Service
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
```

### With Prisma (Alternative)

```typescript
// Prisma Schema (prisma/schema.prisma)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

// Usage in Java (via Prisma Client for Java)
// Or use Prisma in Node.js services
```

## Connection Pooling

### Why Connection Pooling Matters

**The Problem:**
- Each database connection is expensive to create
- Serverless functions create new connections frequently
- Databases have connection limits (PostgreSQL: ~100-200)

**The Solution:**
- Connection pooling reuses connections efficiently
- HikariCP (default in Spring Boot) handles this automatically
- Prisma also manages connection pooling

### Spring Boot Configuration

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
```

### Prisma Configuration

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pooling handled automatically
}

// For serverless (Supabase, Vercel)
// Use connection pooler URL (port 6543)
// DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
```

## Migration Strategy

### Flyway (Java/Spring Boot)

```bash
# Create migration
mvn flyway:migrate

# Migration files: src/main/resources/db/migration/
# V1__Create_users_table.sql
# V2__Add_email_index.sql
```

### Prisma Migrations

```bash
# Create migration
npx prisma migrate dev --name add_user_table

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

## Database Best Practices

### 1. Always Use Migrations
- Never modify database schema manually
- Version control all schema changes
- Test migrations on staging first

### 2. Indexing Strategy
```sql
-- Index frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_post_user_id ON posts(user_id);

-- Composite indexes for common queries
CREATE INDEX idx_post_user_published ON posts(user_id, published);
```

### 3. Connection Management
- Use connection pooling (automatic in Spring Boot)
- Close connections properly
- Monitor connection pool usage
- Set appropriate pool sizes

### 4. Query Optimization
- Use `EXPLAIN ANALYZE` to understand query plans
- Avoid N+1 queries (use JOIN FETCH in JPA)
- Use pagination for large result sets
- Index foreign keys

### 5. Transaction Management
```java
// Spring Boot - Declarative transactions
@Transactional
public User createUserWithPosts(User user, List<Post> posts) {
    User savedUser = userRepository.save(user);
    posts.forEach(post -> post.setUser(savedUser));
    postRepository.saveAll(posts);
    return savedUser;
}
```

## Environment-Specific Configuration

### Development
- Local PostgreSQL or SQLite
- Connection pooling: 5-10 connections
- Detailed logging enabled
- Auto-migration on startup

### Staging
- Shared PostgreSQL instance
- Connection pooling: 10-20 connections
- Standard logging
- Manual migration process

### Production
- Managed PostgreSQL (AWS RDS, Supabase)
- Connection pooling: 20-50 connections
- Minimal logging (errors only)
- Migration via CI/CD pipeline

## Monitoring

### Key Metrics to Monitor
- Connection pool usage
- Query performance (slow queries)
- Database size and growth
- Connection errors
- Transaction rollbacks

### Tools
- **Spring Boot Actuator**: Health checks and metrics
- **pg_stat_statements**: PostgreSQL query statistics
- **Prisma Studio**: Visual database browser
- **CloudWatch/RDS Monitoring**: AWS managed databases

## Related

- [Tooling Overview](/30-tooling)
- [Reference Documentation](/40-reference)
- [Platform Engineering](/domains/platform-engineering)

