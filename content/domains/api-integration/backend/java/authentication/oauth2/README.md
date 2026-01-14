# OAuth2 in Java

OAuth2 authentication implementation for Java Spring Boot.

## Overview

OAuth2 provides secure third-party authentication. This guide covers implementing OAuth2 flows in Spring Boot.

## Implementation

### OAuth2 Controller

```java
@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {
    @Autowired
    private OAuth2AuthorizedClientService clientService;
    
    @GetMapping("/oauth2/authorize")
    public String authorize() {
        String authUrl = "https://auth.example.com/authorize" +
            "?client_id=" + clientId +
            "&redirect_uri=" + redirectUri +
            "&response_type=code" +
            "&scope=read write";
        return authUrl;
    }
    
    @GetMapping("/oauth2/callback")
    public ResponseEntity<TokenResponse> callback(@RequestParam String code) {
        OAuth2AccessTokenResponse response = oauth2Service.getAccessToken(code);
        return ResponseEntity.ok(new TokenResponse(
            response.getAccessToken().getTokenValue(),
            response.getRefreshToken().getTokenValue()
        ));
    }
}
```

## Spring Security OAuth2

```java
@Configuration
@EnableWebSecurity
public class OAuth2SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2Login()
            .authorizationEndpoint()
            .baseUri("/oauth2/authorize")
            .and()
            .redirectionEndpoint()
            .baseUri("/oauth2/callback")
            .and()
            .tokenEndpoint()
            .accessTokenResponseClient(accessTokenResponseClient());
        return http.build();
    }
}
```

## Related

- [Authentication Overview](/domains/api-integration/backend/java/authentication)
- [JWT Tokens](/domains/api-integration/backend/java/authentication/jwt)
- [Frontend OAuth2](/domains/api-integration/frontend/react/authentication/oauth2)

