# JWT Authentication in Java

JSON Web Token (JWT) authentication implementation for Java Spring Boot.

## Overview

JWT tokens provide stateless authentication. This guide covers implementing JWT in Spring Boot.

## Implementation

### JWT Service

```java
@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user.getEmail())
            .claim("userId", user.getId())
            .claim("role", user.getRole())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
    }
    
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        } catch (JwtException e) {
            throw new InvalidTokenException("Invalid JWT token", e);
        }
    }
}
```

### Login Endpoint

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    User user = userService.authenticate(request.getEmail(), request.getPassword());
    String token = jwtService.generateToken(user);
    return ResponseEntity.ok(new AuthResponse(token, user));
}
```

### JWT Filter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {
        
        String token = extractToken(request);
        if (token != null && jwtService.validateToken(token)) {
            Authentication auth = getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

## Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

## Best Practices

1. **Store Secret Securely**: Use environment variables, never commit secrets
2. **Set Appropriate Expiration**: Balance security and user experience
3. **Include User Claims**: Add userId, role, etc. to avoid database lookups
4. **Validate on Every Request**: Always validate token signature and expiration
5. **Use HTTPS**: Always transmit tokens over HTTPS

## Related

- [Authentication Overview](/domains/api-integration/backend/java/authentication)
- [OAuth2](/domains/api-integration/backend/java/authentication/oauth2)
- [Frontend JWT](/domains/api-integration/frontend/react/authentication/jwt)

