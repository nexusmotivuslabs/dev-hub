/**
 * Standardized API Error Response
 * 
 * Provides consistent error format across all API routes
 */

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    status: number
    details?: string[]
    suggestion?: string
  }
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: string[],
    public suggestion?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  toJSON(): ApiErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
        details: this.details,
        suggestion: this.suggestion,
      },
    }
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  status: number,
  details?: string[],
  suggestion?: string
): Response {
  const error = new ApiError(code, message, status, details, suggestion)
  return Response.json(error.toJSON(), { status })
}

/**
 * Common error codes and messages
 */
export const ErrorCodes = {
  // Validation errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_FIELDS: 'MISSING_FIELDS',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Authentication errors (401)
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Authorization errors (403)
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Not found errors (404)
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  
  // Conflict errors (409)
  CONFLICT: 'CONFLICT',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Server errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

/**
 * Helper to create common error responses
 */
export const ErrorHelpers = {
  validation: (message: string, details?: string[], suggestion?: string) =>
    createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      message,
      400,
      details,
      suggestion || 'Please check your input and try again.'
    ),

  missingFields: (fields: string[]) =>
    createErrorResponse(
      ErrorCodes.MISSING_FIELDS,
      `Missing required fields: ${fields.join(', ')}`,
      400,
      fields,
      'Please provide all required fields.'
    ),

  unauthorized: (message = 'Authentication required') =>
    createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      message,
      401,
      undefined,
      'Please log in to access this resource.'
    ),

  invalidCredentials: () =>
    createErrorResponse(
      ErrorCodes.INVALID_CREDENTIALS,
      'Invalid email or password',
      401,
      undefined,
      'Please check your credentials and try again.'
    ),

  forbidden: (message = 'Access denied') =>
    createErrorResponse(
      ErrorCodes.FORBIDDEN,
      message,
      403,
      undefined,
      'You do not have permission to perform this action.'
    ),

  notFound: (resource = 'Resource') =>
    createErrorResponse(
      ErrorCodes.NOT_FOUND,
      `${resource} not found`,
      404,
      undefined,
      'The requested resource does not exist.'
    ),

  conflict: (message: string, suggestion?: string) =>
    createErrorResponse(
      ErrorCodes.CONFLICT,
      message,
      409,
      undefined,
      suggestion || 'This resource already exists. Please use a different value.'
    ),

  internalError: (message = 'An unexpected error occurred') =>
    createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      message,
      500,
      undefined,
      'Please try again later. If the problem persists, contact support.'
    ),
}

