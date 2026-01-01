import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

export type UserRole = 'admin' | 'paid' | 'regular'

export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  createdAt: Date
  updatedAt: Date
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

// Map Prisma UserRole enum to string type
const roleMap: Record<string, UserRole> = {
  REGULAR: 'regular',
  PAID: 'paid',
  ADMIN: 'admin',
}

const roleToPrisma = (role: UserRole): 'REGULAR' | 'PAID' | 'ADMIN' => {
  return role.toUpperCase() as 'REGULAR' | 'PAID' | 'ADMIN'
}

export async function createUser(
  email: string,
  password: string,
  role: UserRole = 'regular',
  name?: string
): Promise<User> {
  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    throw new Error('User with this email already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Map role string to enum
  const prismaRole = roleToPrisma(role)

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: prismaRole,
      name,
    },
  })

  return {
    id: newUser.id,
    email: newUser.email,
    role: roleMap[newUser.role],
    name: newUser.name ?? undefined,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return null
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: roleMap[user.role] },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return {
    user: {
      id: user.id,
      email: user.email,
      role: roleMap[user.role],
      name: user.name ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    role: roleMap[user.role],
    name: user.name ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    role: roleMap[user.role],
    name: user.name ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function verifyToken(token: string): { userId: string; email: string; role: UserRole } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: UserRole
    }
    return decoded
  } catch (error) {
    return null
  }
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<User | null> {
  const prismaRole = roleToPrisma(newRole)
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: prismaRole },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return {
    id: user.id,
    email: user.email,
    role: roleMap[user.role],
    name: user.name ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
