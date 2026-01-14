# Session Management in React

Session-based authentication for React applications.

## Overview

Session management provides server-side authentication state. This guide covers working with sessions in React.

## Implementation

### Session Check

```typescript
useEffect(() => {
  fetch('/api/auth/session', {
    credentials: 'include', // Include cookies
  })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
      }
    });
}, []);
```

## Related

- [Authentication Overview](/domains/api-integration/frontend/react/authentication)
- [JWT Tokens](/domains/api-integration/frontend/react/authentication/jwt)

