# Java Backend API Integration

Java Spring Boot backend API integration patterns and examples.

## Overview

This section covers Java-specific backend API integration using Spring Boot framework.

## Topics

### Getting Started
- [Java Overview](/domains/api-integration/backend/java/overview) - Releases, best practices, tools

### Core Patterns
- [REST APIs](/domains/api-integration/backend/java/rest)
- [Authentication](/domains/api-integration/backend/java/authentication)
- [Error Handling](/domains/api-integration/backend/java/error-handling)
- [Data Transformation](/domains/api-integration/backend/java/data-transformation)
- [Testing](/domains/api-integration/backend/java/testing) - JUnit, Mockito, best practices

## Quick Start

### Basic REST Controller

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
    }
}
```

## Related

- [Backend Overview](/domains/api-integration/backend)
- [Frontend Integration](/domains/api-integration/frontend/react)

