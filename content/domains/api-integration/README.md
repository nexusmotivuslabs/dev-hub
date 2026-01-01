# API Integration

API integration patterns, best practices, and examples from the API Sandbox training platform.

## Overview

This domain covers API integration fundamentals, patterns, and best practices used across our Java backend and React frontend stack.

## Core Concepts

### API Categories

**REST APIs** (90% of use cases)
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON data format
- Stateless communication
- Used for CRUD operations

**GraphQL**
- Single endpoint for all queries
- Client specifies exact data needed
- Reduces over-fetching
- Best for complex nested queries

**gRPC**
- High-performance internal communication
- Protocol Buffers for serialization
- Type-safe contracts
- Best for microservices

**WebSocket**
- Real-time bidirectional communication
- Persistent connections
- Best for chat, notifications, live updates

**Event-Driven**
- Decoupled service communication
- Message queues (Kafka, RabbitMQ)
- Best for async processing

### Universal Technologies

**HTTP/HTTPS**
- Foundation of all web APIs
- Request/Response model
- Status codes (200, 201, 400, 404, 500)
- Works across all languages and platforms

**JSON**
- De facto standard for data exchange
- Human-readable
- Language-agnostic
- Supported everywhere

**OpenAPI/Swagger**
- API contract documentation
- Code generation support
- API testing tools
- Standard format

## Java Backend + React Frontend Pattern

### The Contract

Java and React communicate through a simple HTTP + JSON contract:

**Java Backend (Spring Boot)**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
        // Spring Boot automatically serializes to JSON
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
```

**React Frontend**
```typescript
// Fetch user data
const [user, setUser] = useState(null);

useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(res => res.json())  // HTTP + JSON contract
    .then(data => setUser(data))
    .catch(err => console.error(err));
}, [userId]);

// Create user
const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

**Key Point**: Java and React don't need to know about each other's internal implementation. They only need to agree on the HTTP + JSON contract.

## Authentication Patterns

### OAuth2 Flow

**Backend (Java/Spring Security)**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @GetMapping("/oauth2/authorize")
    public String authorize() {
        // Build authorization URL
        return oauth2Service.getAuthorizationUrl();
    }
    
    @GetMapping("/oauth2/callback")
    public ResponseEntity<TokenResponse> callback(@RequestParam String code) {
        // Exchange code for token
        OAuth2AccessTokenResponse response = oauth2Service.getAccessToken(code);
        return ResponseEntity.ok(new TokenResponse(response));
    }
}
```

**Frontend (React)**
```typescript
const handleOAuthLogin = () => {
  window.location.href = '/api/auth/oauth2/authorize';
};

// Handle callback
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    exchangeCodeForToken(code);
  }
}, []);
```

### JWT Tokens

**Backend (Java)**
```java
@Service
public class JwtService {
    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user.getEmail())
            .setExpiration(new Date(System.currentTimeMillis() + 3600000))
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }
}
```

**Frontend (React)**
```typescript
// Store token
localStorage.setItem('token', token);

// Include in requests
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Resilience Patterns

### Retry with Exponential Backoff

**Backend (Java/Resilience4j)**
```java
@Retry(name = "externalApi", fallbackMethod = "fallback")
public ResponseEntity<String> callExternalApi(String url) {
    RestTemplate restTemplate = new RestTemplate();
    return restTemplate.getForEntity(url, String.class);
}

public ResponseEntity<String> fallback(String url, Exception ex) {
    return ResponseEntity.status(503)
        .body("Service temporarily unavailable");
}
```

**Frontend (React)**
```typescript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Circuit Breaker

**Backend (Java/Resilience4j)**
```java
@CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
public String callExternalService() {
    return restTemplate.getForObject("https://api.example.com/data", String.class);
}
```

## Error Handling

### Backend Error Responses

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            "USER_NOT_FOUND",
            ex.getMessage(),
            HttpStatus.NOT_FOUND.value()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

### Frontend Error Handling

```typescript
async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.code, error.message);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific API errors
      showError(error.message);
    } else {
      // Handle network errors
      showError('Network error. Please try again.');
    }
  }
}
```

## Data Transformation

### Backend to Frontend Mapping

**Backend Entity**
```java
@Entity
public class User {
    private Long id;
    private String emailAddress;  // Different naming
    private LocalDateTime createdAt;
}
```

**Frontend Model**
```typescript
interface User {
  id: string;
  email: string;  // Different naming
  createdAt: Date;
}

// Transform on frontend
function mapToUser(backendUser: any): User {
  return {
    id: backendUser.id.toString(),
    email: backendUser.emailAddress,
    createdAt: new Date(backendUser.createdAt)
  };
}
```

## Best Practices

### 1. Always Validate Input
- Backend: Use Bean Validation (`@Valid`, `@NotNull`)
- Frontend: Validate before sending requests

### 2. Handle Errors Gracefully
- Return consistent error format
- Provide meaningful error messages
- Log errors on backend

### 3. Use Type Safety
- Backend: Strong typing with Java
- Frontend: TypeScript for type safety
- Shared: OpenAPI spec for contract

### 4. Implement Rate Limiting
- Protect backend APIs
- Handle rate limit errors on frontend
- Show user-friendly messages

### 5. Cache When Appropriate
- Cache static data on frontend
- Use ETags for conditional requests
- Implement cache invalidation strategy

## Related

- [Integration Services](/domains/integration-services)
- [Security](/domains/security)
- [Platform Engineering](/domains/platform-engineering)

