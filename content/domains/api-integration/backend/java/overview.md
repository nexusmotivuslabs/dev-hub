# Java Backend Overview

Comprehensive guide to Java development, releases, best practices, and essential tools.

## 📦 Java Releases & Version Status

### Official Java Release Information
- **Oracle Java Releases**: https://www.oracle.com/java/technologies/downloads/
- **OpenJDK Releases**: https://openjdk.org/projects/jdk/
- **Java Version History**: https://en.wikipedia.org/wiki/Java_version_history

### Current Java Versions (Live Status)

#### Java 21 (LTS - Long Term Support)
- **Release Date**: September 2023
- **Status**: ✅ Current LTS
- **Support**: Until September 2028
- **Recommended**: Yes, for new projects
- **Features**: Virtual threads, pattern matching, records, sealed classes

#### Java 17 (LTS)
- **Release Date**: September 2021
- **Status**: ✅ Active LTS
- **Support**: Until September 2026
- **Recommended**: Yes, stable and widely adopted
- **Features**: Sealed classes, pattern matching, text blocks

#### Java 11 (LTS)
- **Release Date**: September 2018
- **Status**: ⚠️ Maintenance mode
- **Support**: Until September 2026
- **Recommended**: Only for legacy projects

#### Java 8 (LTS)
- **Release Date**: March 2014
- **Status**: ⚠️ Legacy
- **Support**: Extended support available
- **Recommended**: No, migrate to newer LTS

### Version Check Commands
```bash
# Check installed Java version
java -version

# Check Java compiler version
javac -version

# Check Java home
echo $JAVA_HOME
```

### Recommended Version for New Projects
**Java 17 or Java 21 (LTS versions)**
- Long-term support
- Modern features
- Better performance
- Security updates

---

## 🎯 Java Best Practices

### 1. Use `var` for Local Variables (Java 10+)

**When to Use `var`**:
- Local variables with obvious types
- Reduces boilerplate
- Improves readability

**Good Examples**:
```java
// ✅ Good: Type is obvious from right side
var user = new User("john@example.com");
var users = new ArrayList<User>();
var count = users.size();
var message = "Hello, " + user.getName();

// ✅ Good: Complex generic types
var userMap = new HashMap<String, List<User>>();
var stream = users.stream().filter(u -> u.isActive());
```

**When NOT to Use `var`**:
```java
// ❌ Bad: Type is not obvious
var result = processData(); // What type is result?

// ❌ Bad: Reduces readability
var x = calculate(); // What does x represent?

// ✅ Good: Use explicit type
User result = processData();
int totalCount = calculate();
```

### 2. Modern Java Features (Java 17+)

#### Records (Java 14+)
```java
// ✅ Modern: Use records for data classes
public record User(String email, String name, LocalDateTime createdAt) {
    // Automatically generates:
    // - Constructor
    // - Getters
    // - equals(), hashCode(), toString()
}

// Usage
var user = new User("john@example.com", "John", LocalDateTime.now());
System.out.println(user.email()); // Getter method
```

#### Pattern Matching (Java 17+)
```java
// ✅ Modern: Pattern matching with instanceof
if (obj instanceof String str) {
    // str is automatically cast
    System.out.println(str.length());
}

// ✅ Pattern matching in switch (Java 21+)
String result = switch (value) {
    case Integer i -> "Integer: " + i;
    case String s -> "String: " + s;
    case null -> "Null value";
    default -> "Unknown";
};
```

#### Sealed Classes (Java 17+)
```java
// ✅ Modern: Sealed classes for controlled inheritance
public sealed class Shape 
    permits Circle, Rectangle, Triangle {
    // Only these classes can extend Shape
}

public final class Circle extends Shape {
    private final double radius;
    // ...
}
```

### 3. Code Style Best Practices

#### Naming Conventions
```java
// ✅ Good: Clear, descriptive names
public class UserService {
    private final UserRepository userRepository;
    
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

// ❌ Bad: Unclear names
public class US {
    private final UR ur;
    public U f(String e) { return ur.f(e); }
}
```

#### Method Design
```java
// ✅ Good: Single responsibility, clear purpose
public User createUser(CreateUserRequest request) {
    validateRequest(request);
    User user = mapToUser(request);
    return userRepository.save(user);
}

// ❌ Bad: Too many responsibilities
public User createUser(CreateUserRequest request) {
    // Validation
    // Mapping
    // Saving
    // Sending email
    // Logging
    // Caching
    // ...
}
```

#### Exception Handling
```java
// ✅ Good: Specific exceptions, clear messages
public User findUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(
            "User not found with id: " + id
        ));
}

// ❌ Bad: Generic exceptions
public User findUserById(Long id) {
    try {
        return userRepository.findById(id).get();
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

### 4. Spring Boot Best Practices

#### Dependency Injection
```java
// ✅ Good: Constructor injection
@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}

// ❌ Bad: Field injection (deprecated)
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

#### REST Controllers
```java
// ✅ Good: Proper HTTP methods, status codes
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .header("Location", "/api/users/" + user.getId())
            .body(user);
    }
}
```

---

## 🛠️ Essential Java Tools

### Testing Tools

#### JUnit 5 (Testing Framework)
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```

**Usage**:
```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {
    private UserService userService;
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserService(userRepository);
    }
    
    @Test
    void shouldCreateUser() {
        // Given
        CreateUserRequest request = new CreateUserRequest(
            "john@example.com", "John"
        );
        User expectedUser = new User(1L, "john@example.com", "John");
        
        when(userRepository.save(any(User.class)))
            .thenReturn(expectedUser);
        
        // When
        User result = userService.createUser(request);
        
        // Then
        assertNotNull(result);
        assertEquals("john@example.com", result.getEmail());
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    void shouldThrowExceptionWhenUserNotFound() {
        // Given
        Long userId = 999L;
        when(userRepository.findById(userId))
            .thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.findById(userId);
        });
    }
}
```

#### Mockito (Mocking Framework)
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.7.0</version>
    <scope>test</scope>
</dependency>
```

**Usage**:
```java
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

// Create mocks
UserRepository userRepository = mock(UserRepository.class);

// Stub behavior
when(userRepository.findById(1L))
    .thenReturn(Optional.of(new User(1L, "john@example.com")));

// Verify interactions
verify(userRepository).findById(1L);
verify(userRepository, times(1)).findById(1L);
verify(userRepository, never()).delete(any());

// Argument matchers
when(userRepository.findByEmail(anyString()))
    .thenReturn(Optional.empty());
when(userRepository.save(any(User.class)))
    .thenAnswer(invocation -> invocation.getArgument(0));
```

#### AssertJ (Fluent Assertions)
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <version>3.24.2</version>
    <scope>test</scope>
</dependency>
```

**Usage**:
```java
import static org.assertj.core.api.Assertions.*;

// Fluent assertions
assertThat(user)
    .isNotNull()
    .hasFieldOrPropertyWithValue("email", "john@example.com")
    .extracting(User::getName, User::getEmail)
    .containsExactly("John", "john@example.com");

assertThat(users)
    .hasSize(3)
    .extracting(User::getEmail)
    .containsExactlyInAnyOrder(
        "user1@example.com",
        "user2@example.com",
        "user3@example.com"
    );
```

### Build Tools

#### Maven
```xml
<!-- pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.2.0</spring-boot.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```

#### Gradle
```groovy
// build.gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.junit.jupiter:junit-jupiter'
    testImplementation 'org.mockito:mockito-core'
}
```

### Code Quality Tools

#### Checkstyle
```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.0</version>
</plugin>
```

#### SpotBugs
```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs</artifactId>
    <version>4.8.3</version>
</dependency>
```

#### SonarQube
- Code quality analysis
- Security vulnerability detection
- Code coverage reporting

---

## 📚 Additional Resources

### Official Documentation
- **Java Documentation**: https://docs.oracle.com/javase/
- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **JUnit 5 Documentation**: https://junit.org/junit5/docs/current/user-guide/
- **Mockito Documentation**: https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html

### Learning Resources
- **Java Tutorials (Oracle)**: https://docs.oracle.com/javase/tutorial/
- **Baeldung**: https://www.baeldung.com/
- **Spring Academy**: https://spring.academy/

---

## Related

- [Java Backend API Integration](/domains/api-integration/backend/java)
- [REST APIs](/domains/api-integration/backend/java/rest)
- [Testing Best Practices](/domains/api-integration/backend/java/testing)

