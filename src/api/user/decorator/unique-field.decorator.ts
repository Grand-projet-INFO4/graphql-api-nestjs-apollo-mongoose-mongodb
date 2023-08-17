import { Validate } from 'class-validator';

import { UniqueUserFieldValidator } from '../validator';
import { User } from '../schema';

/**
 * Decorator that checks if a property is unique for a field across the users collection
 *
 * @param field The field the value must be unique to
 */
export const IsUniqueUserField = (field: keyof User) =>
  Validate(UniqueUserFieldValidator, [field]);
