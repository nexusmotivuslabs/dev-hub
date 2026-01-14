import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization function
function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // Ensure DATABASE_URL is set (use dummy during build if not set)
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy'
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

// Export a proxy that initializes Prisma on first access
// This prevents build-time initialization errors
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return (...args: any[]) => value.apply(client, args)
    }
    return value
  },
})

