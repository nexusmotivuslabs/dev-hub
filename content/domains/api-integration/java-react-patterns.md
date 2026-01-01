# Java Backend + React Frontend Patterns

Common patterns and examples for integrating Java Spring Boot backend with React frontend.

## Communication Pattern

### The Contract

Java and React communicate through **HTTP + JSON** - a universal contract that works regardless of language.

**Key Principle**: The frontend doesn't need to know Java, and the backend doesn't need to know React. They only need to agree on:
- HTTP methods (GET, POST, PUT, DELETE)
- Endpoint URLs
- JSON data format
- Status codes

## REST API Examples

### GET Request

**Backend (Java/Spring Boot)**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
        return ResponseEntity.ok(user);
        // Spring Boot automatically converts to JSON
    }
}
```

**Frontend (React)**
```typescript
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    })
    .then(data => setUser(data))
    .catch(error => console.error('Error:', error));
}, [userId]);
```

### POST Request

**Backend (Java/Spring Boot)**
```java
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
    User user = userService.createUser(request);
    return ResponseEntity
        .status(HttpStatus.CREATED)
        .header("Location", "/api/users/" + user.getId())
        .body(user);
}
```

**Frontend (React)**
```typescript
const createUser = async (userData: CreateUserRequest) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};
```

### PUT Request (Update)

**Backend (Java/Spring Boot)**
```java
@PutMapping("/{id}")
public ResponseEntity<User> updateUser(
    @PathVariable Long id,
    @Valid @RequestBody UpdateUserRequest request) {
    User user = userService.updateUser(id, request);
    return ResponseEntity.ok(user);
}
```

**Frontend (React)**
```typescript
const updateUser = async (id: number, userData: UpdateUserRequest) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return response.json();
};
```

## Authentication Integration

### JWT Token Flow

**Backend (Java/Spring Security)**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        User user = userService.authenticate(request.getEmail(), request.getPassword());
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }
}
```

**Frontend (React)**
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const { token, user } = await response.json();
  localStorage.setItem('token', token);
  return user;
};

// Use token in subsequent requests
const fetchWithAuth = async (url: string) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
```

## Error Handling

### Backend Error Response

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            "USER_NOT_FOUND",
            "User with id " + ex.getId() + " not found",
            HttpStatus.NOT_FOUND.value()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.toList());
            
        ErrorResponse error = new ErrorResponse(
            "VALIDATION_ERROR",
            "Validation failed",
            HttpStatus.BAD_REQUEST.value(),
            errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

### Frontend Error Handling

```typescript
interface ApiError {
  code: string;
  message: string;
  status: number;
  errors?: string[];
}

async function handleApiCall<T>(
  apiCall: () => Promise<Response>
): Promise<T> {
  try {
    const response = await apiCall();
    
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new ApiError(error.code, error.message, error.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API errors
      showError(error.message);
      throw error;
    } else {
      // Handle network errors
      showError('Network error. Please try again.');
      throw error;
    }
  }
}
```

## Data Transformation

### Date Handling

**Backend (Java)**
```java
@Entity
public class User {
    @Column(name = "created_at")
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Jackson automatically serializes to ISO-8601 string
}
```

**Frontend (React/TypeScript)**
```typescript
interface User {
  id: number;
  email: string;
  createdAt: string;  // ISO-8601 string from backend
}

// Convert to Date object
const user: User = await fetchUser();
const createdDate = new Date(user.createdAt);
```

### Naming Conventions

**Backend (Java - camelCase)**
```java
public class User {
    private String emailAddress;
    private LocalDateTime createdAt;
}
```

**Frontend (TypeScript - camelCase)**
```typescript
interface User {
  emailAddress: string;  // Match backend naming
  createdAt: string;
}
```

**Or transform on frontend:**
```typescript
interface User {
  email: string;  // Frontend naming
  createdAt: Date;
}

function mapBackendUser(backend: any): User {
  return {
    email: backend.emailAddress,
    createdAt: new Date(backend.createdAt),
  };
}
```

## CORS Configuration

### Backend (Spring Boot)

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")  // React dev server
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## Type Safety

### OpenAPI/Swagger Contract

**Backend (Java/SpringDoc)**
```java
@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management API")
public class UserController {
    @Operation(summary = "Get user by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        // ...
    }
}
```

**Frontend (TypeScript)**
```typescript
// Generate types from OpenAPI spec
// Use openapi-generator or swagger-codegen

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}
```

## Best Practices

### 1. Consistent Error Format
Always return errors in the same format:
```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "status": 400,
  "errors": ["field1 error", "field2 error"]
}
```

### 2. Use HTTP Status Codes Correctly
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### 3. Validate on Both Sides
- Backend: Always validate (security)
- Frontend: Validate for better UX (immediate feedback)

### 4. Handle Loading States
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await api.getData();
    setData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 5. Use Environment Variables
**Backend (.env)**
```
API_BASE_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8080/api
```

## Related

- [API Integration Overview](/domains/api-integration)
- [Database Notes](/30-tooling/database)
- [Security](/domains/security)

