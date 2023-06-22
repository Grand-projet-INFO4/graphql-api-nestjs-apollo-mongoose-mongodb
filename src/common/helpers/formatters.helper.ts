import { ValidationError } from 'class-validator';

// Type for a field error payload
export type FieldErrorPayload = {
  value: any;
  constraints: {
    [type: string]: string;
  }[];
};

/**
 * Formats the class-validator errors into a key-value pairs format
 *
 * @param errors The validation error array provided by the class-validator exception factory
 * @returns The same error data formatted into key-value pairs of field-errors
 */
export function formatValidationErrors(
  errors: ValidationError[],
): Record<string, FieldErrorPayload> {
  const formattedErrors: Record<string, FieldErrorPayload> = {};
  for (const error of errors) {
    const field = error.property;
    if (!error.constraints) continue;
    const constraints = Object.entries(error.constraints).map(
      ([constraint, message]) => ({ [constraint]: message }),
    );
    formattedErrors[field] = {
      value: error.value,
      constraints,
    };
  }
  return formattedErrors;
}
