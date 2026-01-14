# JWT Authentication in React

JSON Web Token (JWT) authentication implementation for React applications.

## Overview

JWT tokens provide stateless authentication. This guide covers implementing JWT in React.

## Implementation

### Login Function

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const { token, user } = await response.json();
  localStorage.setItem('token', token);
  return user;
};
```

### Using Token in Requests

```typescript
const fetchWithAuth = async (url: string) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
```

### Auth Context

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const { token, user } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Protected Route

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}
```

## Best Practices

1. **Store Securely**: Use httpOnly cookies when possible, or localStorage for SPA
2. **Handle Expiration**: Check token expiration and refresh when needed
3. **Clear on Logout**: Always clear tokens when user logs out
4. **Include in Requests**: Add token to Authorization header for all protected requests
5. **Handle Errors**: Handle 401 errors by redirecting to login

## Related

- [Authentication Overview](/domains/api-integration/frontend/react/authentication)
- [OAuth2](/domains/api-integration/frontend/react/authentication/oauth2)
- [Backend JWT](/domains/api-integration/backend/java/authentication/jwt)

