import { Validate } from 'class-validator';
import { CityFieldExistsValidator } from '../validator';

/**
 * Decorator around the city field existence validator
 *
 * @param field A city field
 */
export const CityFieldExists = (field: string) =>
  Validate(CityFieldExistsValidator, [field]);
