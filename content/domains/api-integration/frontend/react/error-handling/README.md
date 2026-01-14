# Error Handling in React

Error handling patterns and best practices for React API calls.

## Overview

Proper error handling improves user experience and application reliability.

## Implementation

### Error Interface

```typescript
interface ApiError {
  code: string;
  message: string;
  status: number;
  errors?: string[];
}
```

### Error Handling Function

```typescript
async function handleApiCall<T>(
  apiCall: () => Promise<Response>
): Promise<T> {
  try {
    const response = await apiCall();
    
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new ApiError(error.code, error.message, error.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API errors
      showError(error.message);
      throw error;
    } else {
      // Handle network errors
      showError('Network error. Please try again.');
      throw error;
    }
  }
}
```

### Error Boundary

```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

### Loading and Error States

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await api.getData();
    setData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## Best Practices

1. **Consistent Error Format**: Handle errors from backend consistently
2. **User-Friendly Messages**: Show clear, actionable error messages
3. **Error Logging**: Log errors for debugging
4. **Loading States**: Show loading indicators during API calls
5. **Retry Logic**: Implement retry for transient errors

## Related

- [React Overview](/domains/api-integration/frontend/react)
- [REST APIs](/domains/api-integration/frontend/react/rest)
- [Backend Error Handling](/domains/api-integration/backend/java/error-handling)

