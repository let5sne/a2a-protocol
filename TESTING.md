# Testing Guide

## Overview

A2A Protocol uses Jest for testing with TypeScript support.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/__tests__/
├── agent.test.ts        # Agent class tests
├── server.test.ts       # Registry server API tests
├── types.test.ts        # Message protocol tests
└── integration.test.ts  # End-to-end integration tests
```

## Coverage Requirements

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Writing Tests

### Unit Test Example

```typescript
import { Agent } from '../agent';

describe('Agent', () => {
  it('should register successfully', async () => {
    const agent = new Agent('TestAgent', ['test']);
    // Test implementation
  });
});
```

### API Test Example

```typescript
import request from 'supertest';

describe('API', () => {
  it('should register agent', async () => {
    const response = await request(app)
      .post('/agents/register')
      .send({ name: 'Test', capabilities: [] });
    
    expect(response.status).toBe(200);
  });
});
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Before deployment

## Future Improvements

- [ ] Add E2E tests with real WebSocket connections
- [ ] Add performance tests
- [ ] Add security tests
- [ ] Increase coverage to 90%
