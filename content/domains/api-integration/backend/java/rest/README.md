# REST APIs in Java

REST API implementation patterns using Java Spring Boot.

## Overview

REST (Representational State Transfer) is the most common API pattern. This guide covers implementing REST APIs in Java Spring Boot.

## HTTP Methods

### GET - Read Operations

```java
@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
    return ResponseEntity.ok(user);
}

@GetMapping
public ResponseEntity<List<User>> getAllUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    Page<User> users = userService.findAll(PageRequest.of(page, size));
    return ResponseEntity.ok(users.getContent());
}
```

### POST - Create Operations

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

### PUT - Update Operations

```java
@PutMapping("/{id}")
public ResponseEntity<User> updateUser(
    @PathVariable Long id,
    @Valid @RequestBody UpdateUserRequest request) {
    User user = userService.updateUser(id, request);
    return ResponseEntity.ok(user);
}
```

### DELETE - Delete Operations

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
}
```

## Best Practices

### 1. Use Proper HTTP Status Codes
- 200: Success
- 201: Created
- 204: No Content (for DELETE)
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

### 2. Consistent Response Format

```java
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private LocalDateTime timestamp;
}
```

### 3. Input Validation

```java
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
    // @Valid triggers validation
    // Validation defined in CreateUserRequest class
}

public class CreateUserRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
```

## Related

- [Java Backend Overview](/domains/api-integration/backend/java)
- [Authentication](/domains/api-integration/backend/java/authentication)
- [Error Handling](/domains/api-integration/backend/java/error-handling)

