import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

// Parameter decorator that returns a request's bearer token from the authorization headers
export const BearerToken = createParamDecorator(
  (data: 'REST' | 'GraphQL' = 'GraphQL', ctx: ExecutionContext) => {
    const request =
      data === 'GraphQL'
        ? GqlExecutionContext.create(ctx).getContext().req
        : (ctx.switchToHttp().getRequest() as Request);
    const token = (request.headers.authorization as string).split(' ')[1];
    return token;
  },
);
