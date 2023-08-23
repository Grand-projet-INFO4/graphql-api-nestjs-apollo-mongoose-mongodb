import {
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Validator as an abstract class that makes sure that field value already exists in the database
export abstract class FieldExistsValidator
  implements ValidatorConstraintInterface
{
  // The default error message
  protected message: string;

  // Checks for the field value's existance
  abstract checkIfExists(
    field: string | string[],
    value: unknown,
  ): Promise<boolean> | boolean;

  async validate(value: any, args: ValidationArguments) {
    const [field] = args.constraints as [string];
    const isUniqueResult = this.checkIfExists(field, value);
    return typeof isUniqueResult === 'boolean'
      ? isUniqueResult
      : await isUniqueResult;
  }

  defaultMessage(args: ValidationArguments): string {
    const [field] = args.constraints as [string];
    return this.message ?? `The ${field} already does not exist`;
  }
}
