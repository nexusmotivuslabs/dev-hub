# Testing in Java

Comprehensive guide to testing Java applications with JUnit, Mockito, and best practices.

## Overview

Testing is crucial for maintaining code quality and preventing regressions. This guide covers essential testing tools and patterns for Java backend development.

## Testing Tools

### JUnit 5

**What it is**: The standard testing framework for Java.

**Key Features**:
- Annotations-based test definition
- Assertions for test validation
- Test lifecycle management
- Parameterized tests
- Test suites

**Basic Example**:
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {
    private UserService userService;
    
    @BeforeEach
    void setUp() {
        userService = new UserService();
    }
    
    @Test
    void shouldCreateUser() {
        // Given
        String email = "john@example.com";
        String name = "John";
        
        // When
        User user = userService.createUser(email, name);
        
        // Then
        assertNotNull(user);
        assertEquals(email, user.getEmail());
        assertEquals(name, user.getName());
    }
}
```

### Mockito

**What it is**: Mocking framework for creating test doubles.

**Key Features**:
- Create mock objects
- Stub method behavior
- Verify method calls
- Argument matchers
- Spy objects

**Basic Example**:
```java
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class UserServiceTest {
    @Test
    void shouldFindUserById() {
        // Given
        UserRepository repository = mock(UserRepository.class);
        UserService service = new UserService(repository);
        User expectedUser = new User(1L, "john@example.com");
        
        when(repository.findById(1L))
            .thenReturn(Optional.of(expectedUser));
        
        // When
        User result = service.findById(1L);
        
        // Then
        assertEquals(expectedUser, result);
        verify(repository).findById(1L);
    }
}
```

### AssertJ

**What it is**: Fluent assertion library for readable tests.

**Key Features**:
- Fluent API
- Rich assertion methods
- Collection assertions
- Exception assertions

**Example**:
```java
import static org.assertj.core.api.Assertions.*;

assertThat(user)
    .isNotNull()
    .hasFieldOrPropertyWithValue("email", "john@example.com")
    .extracting(User::getName)
    .isEqualTo("John");
```

## Testing Patterns

### Arrange-Act-Assert (AAA)

```java
@Test
void shouldUpdateUser() {
    // Arrange (Given)
    UserRepository repository = mock(UserRepository.class);
    UserService service = new UserService(repository);
    User existingUser = new User(1L, "old@example.com");
    UpdateUserRequest request = new UpdateUserRequest("new@example.com");
    
    when(repository.findById(1L))
        .thenReturn(Optional.of(existingUser));
    when(repository.save(any(User.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));
    
    // Act (When)
    User result = service.updateUser(1L, request);
    
    // Assert (Then)
    assertThat(result.getEmail()).isEqualTo("new@example.com");
    verify(repository).findById(1L);
    verify(repository).save(any(User.class));
}
```

### Test Doubles

**Mock**: Completely fake object with stubbed behavior
```java
UserRepository mockRepo = mock(UserRepository.class);
when(mockRepo.findById(1L)).thenReturn(Optional.of(user));
```

**Spy**: Real object with some methods mocked
```java
UserService spyService = spy(new UserService());
doReturn(user).when(spyService).findById(1L);
```

**Stub**: Object that returns predefined responses
```java
UserRepository stubRepo = new UserRepository() {
    @Override
    public Optional<User> findById(Long id) {
        return Optional.of(new User(id, "test@example.com"));
    }
};
```

## Best Practices

### 1. Test Naming
```java
// ✅ Good: Descriptive test names
@Test
void shouldThrowExceptionWhenUserNotFound() { }

@Test
void shouldReturnEmptyListWhenNoUsersExist() { }

// ❌ Bad: Unclear names
@Test
void test1() { }

@Test
void userTest() { }
```

### 2. One Assertion Per Test (When Possible)
```java
// ✅ Good: Single responsibility
@Test
void shouldReturnUserWithCorrectEmail() {
    User user = service.createUser("john@example.com", "John");
    assertEquals("john@example.com", user.getEmail());
}

// ⚠️ Acceptable: Related assertions
@Test
void shouldCreateValidUser() {
    User user = service.createUser("john@example.com", "John");
    assertNotNull(user);
    assertEquals("john@example.com", user.getEmail());
    assertNotNull(user.getId());
}
```

### 3. Test Isolation
```java
// ✅ Good: Each test is independent
@BeforeEach
void setUp() {
    // Fresh state for each test
    userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);
}

@Test
void test1() {
    // Doesn't depend on other tests
}

@Test
void test2() {
    // Doesn't depend on test1
}
```

### 4. Use Test Data Builders
```java
// ✅ Good: Test data builder pattern
public class UserTestBuilder {
    private Long id = 1L;
    private String email = "test@example.com";
    private String name = "Test User";
    
    public UserTestBuilder withEmail(String email) {
        this.email = email;
        return this;
    }
    
    public User build() {
        return new User(id, email, name);
    }
}

// Usage
User user = new UserTestBuilder()
    .withEmail("john@example.com")
    .withName("John")
    .build();
```

## Integration Testing

### Spring Boot Test
```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldCreateUser() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest(
            "john@example.com", "John"
        );
        
        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value("john@example.com"));
    }
}
```

## Test Coverage

### Aim for High Coverage
- **Unit Tests**: 80%+ coverage
- **Critical Paths**: 100% coverage
- **Integration Tests**: Cover main flows

### Tools
- **JaCoCo**: Code coverage tool
- **SonarQube**: Coverage reporting
- **IntelliJ IDEA**: Built-in coverage

## Related

- [Java Backend Overview](/domains/api-integration/backend/java/overview)
- [REST APIs](/domains/api-integration/backend/java/rest)
- [Error Handling](/domains/api-integration/backend/java/error-handling)

