import {
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Validator as an abstract class that checks if a value is unique based on a given model
export abstract class UniqueFieldValidator
  implements ValidatorConstraintInterface
{
  // The default error message
  protected message: string;

  // Checks for the value's uniqueness in the database
  abstract checkUnique(
    field: string | string[],
    value: unknown,
  ): Promise<boolean> | boolean;

  async validate(value: any, args: ValidationArguments) {
    const [field] = args.constraints as [string];
    const isUniqueResult = this.checkUnique(field, value);
    return typeof isUniqueResult === 'boolean'
      ? isUniqueResult
      : await isUniqueResult;
  }

  defaultMessage(args: ValidationArguments): string {
    const [field] = args.constraints as [string];
    return this.message ?? `The ${field} is already taken`;
  }
}
