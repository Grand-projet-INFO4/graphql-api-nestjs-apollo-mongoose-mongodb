import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { IsUniqueUserField } from '../../user/decorator';
import { IsEqualTo } from 'src/common/decorators';
import { SignupInput } from 'src/graphql/schema';

// Regex for the valid user name
const validUsernameSchema = /^('?[A-z]+'?\s?)+$/;

// Regex for a valid malagasy phone number
const mgPhoneNumberRegex = /^(\+261|0)(32|33|34)\d{7}$/;

export default class SignupDTO implements SignupInput {
  @Matches(validUsernameSchema, {
    message: 'The first name is not valid',
  })
  @MaxLength(50, {
    message: 'The first name must must exceed 50 characters',
  })
  @MinLength(2, {
    message: 'The first name must contain at least 2 characters',
  })
  @IsNotEmpty({ message: 'The first name must not be empty' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @Matches(validUsernameSchema, {
    message: 'The last name is not valid',
  })
  @MaxLength(50, {
    message: 'The last name must must exceed 50 characters',
  })
  @MinLength(2, {
    message: 'The last name must contain at least 2 characters',
  })
  @IsNotEmpty({ message: 'The last name must not be empty' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsUniqueUserField('username')
  @IsNotEmpty({ message: 'The username must not be empty' })
  @Transform(({ value }) => value?.trim())
  username: string;

  @IsUniqueUserField('email')
  @IsEmail({}, { message: 'The email is not a valid email address' })
  @IsNotEmpty({ message: 'The email must not be empty' })
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsUniqueUserField('phone')
  @Matches(mgPhoneNumberRegex, {
    message: 'The phone number is not a valid malagasy phone number',
  })
  @Transform(({ value }) => (value as string).trim().replace(/\s/g, ''))
  @IsNotEmpty({ message: 'The phone number must not be empty' })
  phone: string;

  @IsStrongPassword(
    {},
    {
      message:
        'The password must have at leat 8 characters and must contain at least 1 lowercase, 1 uppercase, and 1 special character',
    },
  )
  @IsNotEmpty({ message: 'The password must not be empty' })
  @Transform(({ value }) => value?.trim())
  password: string;

  @IsEqualTo<SignupDTO>('password', {
    message: 'The password confirmation is wrong',
  })
  @IsNotEmpty({ message: 'The password must be confirmed' })
  @Transform(({ value }) => value?.trim())
  passwordConfirmation: string;
}
