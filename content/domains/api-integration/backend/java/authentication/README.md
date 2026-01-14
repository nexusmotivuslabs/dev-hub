# Authentication in Java

Authentication patterns and implementations for Java Spring Boot backends.

## Overview

This section covers authentication patterns including JWT tokens, OAuth2, and session management.

## Topics

- [JWT Tokens](/domains/api-integration/backend/java/authentication/jwt)
- [OAuth2](/domains/api-integration/backend/java/authentication/oauth2)
- [Session Management](/domains/api-integration/backend/java/authentication/sessions)

## Quick Example

### Basic JWT Authentication

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

## Related

- [Java Backend Overview](/domains/api-integration/backend/java)
- [REST APIs](/domains/api-integration/backend/java/rest)
- [Frontend Authentication](/domains/api-integration/frontend/react/authentication)

