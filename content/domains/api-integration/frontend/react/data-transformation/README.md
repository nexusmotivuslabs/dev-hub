# Data Transformation in React

Data transformation patterns for React frontends.

## Overview

Data transformation ensures consistent data formats between backend and frontend.

## Date Handling

```typescript
interface User {
  id: number;
  email: string;
  createdAt: string;  // ISO-8601 string from backend
}

// Convert to Date object
const user: User = await fetchUser();
const createdDate = new Date(user.createdAt);
```

## Naming Conventions

### Match Backend

```typescript
interface User {
  emailAddress: string;  // Match backend naming
  createdAt: string;
}
```

### Transform on Frontend

```typescript
interface User {
  email: string;  // Frontend naming
  createdAt: Date;
}

function mapBackendUser(backend: any): User {
  return {
    email: backend.emailAddress,
    createdAt: new Date(backend.createdAt),
  };
}
```

## Transformation Utilities

```typescript
// Date formatting
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

// Data mapping
function mapUserResponse(response: any): User {
  return {
    id: response.id,
    email: response.emailAddress,
    name: response.fullName,
    createdAt: new Date(response.createdAt),
  };
}
```

## Related

- [React Overview](/domains/api-integration/frontend/react)
- [REST APIs](/domains/api-integration/frontend/react/rest)
- [Backend Data Transformation](/domains/api-integration/backend/java/data-transformation)

