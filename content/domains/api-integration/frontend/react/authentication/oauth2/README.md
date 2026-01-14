# OAuth2 in React

OAuth2 authentication implementation for React applications.

## Overview

OAuth2 provides secure third-party authentication. This guide covers implementing OAuth2 flows in React.

## Implementation

### OAuth2 Login

```typescript
const handleOAuthLogin = () => {
  window.location.href = '/api/auth/oauth2/authorize';
};
```

### Handle Callback

```typescript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    exchangeCodeForToken(code);
  }
}, []);

const exchangeCodeForToken = async (code: string) => {
  const response = await fetch('/api/auth/oauth2/callback', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  const { token, user } = await response.json();
  localStorage.setItem('token', token);
  setUser(user);
};
```

## Related

- [Authentication Overview](/domains/api-integration/frontend/react/authentication)
- [JWT Tokens](/domains/api-integration/frontend/react/authentication/jwt)
- [Backend OAuth2](/domains/api-integration/backend/java/authentication/oauth2)

