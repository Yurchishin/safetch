![AnyLint Logo](https://res.cloudinary.com/da0ggymug/image/upload/v1695855927/safetch_full.png)

**Safetch** is a TypeScript library that provide typesafe [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) and [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) API. All API is immutable and typesafe.

## Installation

To install, run the following command:

```bash
npm install safetch qs
```

## Usage

### Importing the Package
To use the **safetch** package, import the necessary functions as follows:

```typescript
import { safetch, origin } from 'safetch';
```

### Creating Origins

An **origin** in safetch represents the base URL of an API. You can create origin instances for different APIs like this:

```typescript
const backend = origin('https://be.example.com');
const cms = origin('https://cms.example.com');
```

### Defining Data Models

You can define data models for validation and type checking using libraries like [Zod](https://zod.dev) or any other validation library. For example:

```typescript
import z from 'zod';

const User = z.object({
  id: z.number(),
  name: z.string(),
});
```

### Making Requests

You can use the **safetch** function to create and execute API requests. Below are examples of how to use **safetch** with origins and optional data validation.

#### Example 1: Fetching User Data

```typescript
const getUser = (id: number) =>
  safetch(
    backend
      .pathPattern('/users/[id]', {
        id: 'number',
      })
      .url(
        {
          locale: 'en',
        },
        '#some-hash'
      )
  )
    .then(res => res.json()) // Promise<any> -> Promise<unknown> because native response.json() returns any, and it's good to use `any` type
    .then(data => User.parse(data)); // Promise<unknown> -> Promise<User>
```

In this example, we fetch user data from the backend origin. We specify the API path and provide a parameterized path pattern to include the user ID.

#### Example 2: Fetching Configuration Data

```typescript
const getConfig = () =>
  safetch(
    cms.pathPattern('/config', null)
      .url()
      .search({
        locale: 'en',
      })
      .hash('#some-hash'),
  ).then(res => res.json()); // Promise<any> -> Promise<unknown> because native response.json() returns any, and it's good to use `any` type
```

In this example, we fetch configuration data from the cms origin. We specify the API path and add a query parameter to request data in a specific locale.

## Path Pattern

The **pathPattern** function is used to create a path pattern for an API request. It takes two arguments:

- **pathPattern**: The path pattern string.
- **params**: An object containing the parameter names and types.

## Parameter Types

We support the following parameter types like [NextJS](https://nextjs.org/docs/app/api-reference/functions/use-params#returns):

- **single parameter**: `[id]`
- **catch-all parameter**: `[...id]`
- **optional catch-all parameter**: `[[...id]]`

### Example:

```typescript
// /users/1
const path = origin('https://example.com')
    .pathPattern('/users/[id]', {
        id: '1',
    })

// /users/1/2
const path = origin('https://example.com')
    .pathPattern('/users/[...id]', {
        id: ['1', '2'],
    })

// /users
const path = origin('https://example.com')
  .pathPattern('/users/[[...id]]', {
    id: [],
  })
```

### Type safety

Path pattern is typesafe. If you pass wrong parameters, you will get an error:

![typesafe](https://res.cloudinary.com/da0ggymug/image/upload/v1697225697/Screenshot_2023-10-13_at_22.34.49.png)

Safetch empowers you to create robust and type-safe APIs effortlessly, making your development process more efficient and reliable. Start using Safetch today for a better, safer development experience.
