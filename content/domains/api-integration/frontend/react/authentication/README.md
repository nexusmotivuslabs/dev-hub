# Authentication in React

Authentication patterns and implementations for React frontends.

## Overview

This section covers authentication patterns including JWT tokens, OAuth2, and session management in React.

## Topics

- [JWT Tokens](/domains/api-integration/frontend/react/authentication/jwt)
- [OAuth2](/domains/api-integration/frontend/react/authentication/oauth2)
- [Session Management](/domains/api-integration/frontend/react/authentication/sessions)

## Quick Example

### Basic Login

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

## Related

- [React Overview](/domains/api-integration/frontend/react)
- [REST APIs](/domains/api-integration/frontend/react/rest)
- [Backend Authentication](/domains/api-integration/backend/java/authentication)

