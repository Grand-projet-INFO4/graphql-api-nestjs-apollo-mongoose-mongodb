import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { PolicyDefinition, UserAction } from '../auth.policy';
import {
  PolicyDefinitionConstructor,
  CHECK_POLICIES_KEY,
  PolicyGuard,
} from '../guard';

// Compound decorator that combines the @CheckPolicy decorator and the policy guard together
export function ApplyPolicy(
  Policy: PolicyDefinitionConstructor<PolicyDefinition>,
  action: UserAction,
  subject: unknown,
) {
  return applyDecorators(
    SetMetadata(CHECK_POLICIES_KEY, [[Policy, action, subject]]),
    UseGuards(PolicyGuard),
  );
}

// Compound decorator that combines the @CheckPolicies decorator and the policy guard together
export function ApplyPolicies(
  ...policyConstraints: [
    PolicyDefinitionConstructor<PolicyDefinition>,
    UserAction,
    unknown,
  ][]
) {
  return applyDecorators(
    SetMetadata(CHECK_POLICIES_KEY, policyConstraints),
    UseGuards(PolicyGuard),
  );
}
