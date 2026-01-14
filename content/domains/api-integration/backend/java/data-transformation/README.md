# Data Transformation in Java

Data transformation patterns for Java Spring Boot APIs.

## Overview

Data transformation ensures consistent data formats between backend and frontend.

## Date Handling

```java
@Entity
public class User {
    @Column(name = "created_at")
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Jackson automatically serializes to ISO-8601 string
}
```

## DTOs (Data Transfer Objects)

```java
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String createdAt; // ISO-8601 string
    
    // Getters and setters
}

// Convert Entity to DTO
public UserDTO toDTO(User user) {
    UserDTO dto = new UserDTO();
    dto.setId(user.getId());
    dto.setEmail(user.getEmail());
    dto.setName(user.getName());
    dto.setCreatedAt(user.getCreatedAt().toString());
    return dto;
}
```

## Jackson Configuration

```java
@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}
```

## Related

- [Java Backend Overview](/domains/api-integration/backend/java)
- [REST APIs](/domains/api-integration/backend/java/rest)

