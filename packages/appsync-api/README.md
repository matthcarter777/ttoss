# @ttoss/appsync-api

This package provides a opinionated way to create an AppSync API using [`@ttoss/graphql-api` API](./graphql-api/).

## Installation

```bash
yarn add @ttoss/appsync-api @ttoss/graphql-api graphql
```

## Quickstart

You can create and deploy an AppSync API in four steps:

1. Create a `schemaComposer` object using [`graphql-compose`](https://graphql-compose.github.io/docs/intro/quick-start.html), that the next steps will use to create the API.

2. Create a `cloudformation.ts` file that exports a CloudFormation template using `createApiTemplate`:

```typescript
import { createApiTemplate } from '@ttoss/appsync-api';
import { schemaComposer } from './schemaComposer';

const template = createApiTemplate({
  schemaComposer,
  dataSource: {
    roleArn: {
      'Fn::ImportValue': 'AppSyncLambdaDataSourceIAMRoleArn',
    },
  },
  lambdaFunction: {
    roleArn: {
      'Fn::ImportValue': 'AppSyncLambdaFunctionIAMRoleArn',
    },
  },
});

export default template;
```

3. Create a `lambda.ts` file that exports a Lambda handler function using `createAppSyncResolverHandler`:

```typescript
import { createAppSyncResolverHandler } from '@ttoss/appsync-api';
import { schemaComposer } from './schemaComposer';

export const handler = createAppSyncResolverHandler({ schemaComposer });
```

4. Add `graphql` to the `lambdaExternals` array on `carlin.yml`:

```yml
lambdaExternals:
  - graphql
```

Now you can deploy your API using `carlin deploy`:

```bash
carlin deploy
```

## Advanced Usage

### Middlewares

You can add middlewares compatible with [`graphql-middleware`](https://github.com/dimatill/graphql-middleware) to the server using the `middlewares` option.

```ts
import { createAppSyncResolverHandler } from '@ttoss/appsync-api';
import { schemaComposer } from './schemaComposer';
import { allow, deny, shield } from 'graphql-shield';

const NotAuthorizedError = new Error('Not authorized!');
/**
 * The error name is the same value `errorType` on GraphQL errors response.
 */
NotAuthorizedError.name = 'NotAuthorizedError';

const permissions = shield(
  {
    Query: {
      '*': deny,
      author: allow,
    },
    Author: {
      id: allow,
      name: allow,
    },
  },
  {
    fallbackRule: deny,
    fallbackError: NotAuthorizedError,
  }
);

export const handler = createAppSyncResolverHandler({
  schemaComposer,
  middlewares: [permissions],
});
```

### Custom domain name

You can add a custom domain name to your API using the `customDomain` option.

```ts
import { createApiTemplate } from '@ttoss/appsync-api';

export const handler = createApiTemplate({
  schemaComposer,
  customDomain: {
    domainName: 'api.example.com', // required
    certificateArn: {
      'Fn::ImportValue': 'AppSyncDomainCertificateArn',
    }, // required
  },
});
```

If your domain is on Route53, you can use the option `customDomain.hostedZoneName` to create the required DNS records.

```ts
import { createApiTemplate } from '@ttoss/appsync-api';

export const template = createApiTemplate({
  schemaComposer,
  customDomain: {
    domainName: 'api.example.com', // required
    certificateArn: {
      'Fn::ImportValue': 'AppSyncDomainCertificateArn',
    }, // required
    hostedZoneName: 'example.com.', // optional
  },
});
```
