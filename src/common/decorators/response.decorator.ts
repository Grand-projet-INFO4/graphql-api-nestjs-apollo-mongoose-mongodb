import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

// Parameter decorator that returns a request's response object
export const Res = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return (GqlExecutionContext.create(ctx).getContext().req as Request).res;
  },
);
