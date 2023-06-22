import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Parameter decorator that returns a request's authenticated user
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return GqlExecutionContext.create(ctx).getContext().req.user;
  },
);
