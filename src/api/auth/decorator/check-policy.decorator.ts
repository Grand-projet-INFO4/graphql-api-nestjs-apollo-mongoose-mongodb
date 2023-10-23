import { SetMetadata } from '@nestjs/common';

import { PolicyDefinition, UserAction } from '../auth.policy';
import { PolicyDefinitionConstructor, CHECK_POLICIES_KEY } from '../guard';

// Sets the reflector metadata for a policy and user action at controller or resolver level
export function CheckPolicy(
  Policy: PolicyDefinitionConstructor<PolicyDefinition>,
  action: UserAction,
  subject: unknown,
) {
  return SetMetadata(CHECK_POLICIES_KEY, [[Policy, action, subject]]);
}

// Sets the reflector metadata for the combinations of policy and user action at controller or resolver level
export function CheckPolicies(
  ...policyConstraints: [
    PolicyDefinitionConstructor<PolicyDefinition>,
    UserAction,
    unknown,
  ][]
) {
  return SetMetadata(CHECK_POLICIES_KEY, policyConstraints);
}
