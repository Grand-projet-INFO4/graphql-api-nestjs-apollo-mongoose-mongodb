import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('RefreshTokenJwt') {
  constructor(private layer: 'REST' | 'GraphQL' = 'GraphQL') {
    super();
  }

  /**
   * Gets the request object of the graphQL request being made
   *
   * @param context The default execution context provided by NestJS
   * @returns The request object
   */
  getRequest(context: ExecutionContext) {
    if (this.layer === 'GraphQL') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req as Request;
    } else {
      return context.switchToHttp().getRequest();
    }
  }
}
