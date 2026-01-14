# Error Handling in Java

Error handling patterns and best practices for Java Spring Boot APIs.

## Overview

Consistent error handling is crucial for API reliability and developer experience.

## Global Exception Handler

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
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            "INTERNAL_ERROR",
            "An unexpected error occurred",
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        // Log the actual exception
        logger.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

## Error Response Model

```java
public class ErrorResponse {
    private String code;
    private String message;
    private int status;
    private List<String> errors;
    private LocalDateTime timestamp;
    
    // Constructors, getters, setters
}
```

## Custom Exceptions

```java
public class UserNotFoundException extends RuntimeException {
    private Long id;
    
    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
        this.id = id;
    }
}
```

## Best Practices

1. **Consistent Error Format**: Always return errors in the same structure
2. **Proper HTTP Status Codes**: Use appropriate status codes (400, 404, 500)
3. **Log Errors**: Log exceptions for debugging, but don't expose internals
4. **User-Friendly Messages**: Provide clear, actionable error messages
5. **Validation Errors**: Return field-level validation errors

## Related

- [Java Backend Overview](/domains/api-integration/backend/java)
- [REST APIs](/domains/api-integration/backend/java/rest)
- [Frontend Error Handling](/domains/api-integration/frontend/react/error-handling)

