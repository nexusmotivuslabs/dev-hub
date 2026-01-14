# Session Management in Java

Session-based authentication for Java Spring Boot.

## Overview

Session management provides server-side authentication state. This guide covers implementing sessions in Spring Boot.

## Implementation

### Session Configuration

```java
@Configuration
@EnableWebSecurity
public class SessionConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            .maximumSessions(1)
            .maxSessionsPreventsLogin(false);
        return http.build();
    }
}
```

## Related

- [Authentication Overview](/domains/api-integration/backend/java/authentication)
- [JWT Tokens](/domains/api-integration/backend/java/authentication/jwt)

