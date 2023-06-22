import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('AccessTokenJwt') {
  /**
   * Gets the request object of the graphQL request being made
   *
   * @param context The default execution context provided by NestJS
   * @returns The request object
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req as Request;
  }
}
