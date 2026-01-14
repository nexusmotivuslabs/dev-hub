# REST APIs in React

REST API integration patterns using React and TypeScript.

## Overview

This guide covers making REST API calls from React applications.

## HTTP Methods

### GET - Read Operations

```typescript
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    })
    .then(data => setUser(data))
    .catch(error => console.error('Error:', error));
}, [userId]);
```

### POST - Create Operations

```typescript
const createUser = async (userData: CreateUserRequest) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
};
```

### PUT - Update Operations

```typescript
const updateUser = async (id: number, userData: UpdateUserRequest) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return response.json();
};
```

### DELETE - Delete Operations

```typescript
const deleteUser = async (id: number) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
};
```

## Custom Hook

```typescript
function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}
```

## Related

- [React Overview](/domains/api-integration/frontend/react)
- [Authentication](/domains/api-integration/frontend/react/authentication)
- [Error Handling](/domains/api-integration/frontend/react/error-handling)

