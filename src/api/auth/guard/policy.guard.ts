import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { PolicyDefinition, UserAction } from '../auth.policy';
import { ReqAuthUser } from '../auth';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface PolicyDefinitionConstructor<T extends PolicyDefinition> {
  new (): T;
}

// Reflector metadata key that hold the provided policies at controller or resolver level
export const CHECK_POLICIES_KEY = 'CURRENT_POLICIES';

// Guard that authorizes policies from metadata provided at controller or resolver level
@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const policyConstraints =
      this.reflector.get<
        [PolicyDefinitionConstructor<PolicyDefinition>, UserAction, unknown][]
      >(CHECK_POLICIES_KEY, ctx.getHandler()) ?? [];
    const authUser = GqlExecutionContext.create(ctx).getContext().req
      .user as ReqAuthUser;
    if (!authUser) {
      throw new UnauthorizedException(
        'You must be authenticated to perform this action',
      );
    }
    return policyConstraints.every(([Policy, action, subject]) => {
      const policy = new Policy();
      return policy.authorize(authUser, action, subject);
    });
  }
}
