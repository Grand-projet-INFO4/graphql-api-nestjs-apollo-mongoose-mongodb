import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class SigninDTO {
  /**
   * Email or Phone number
   */
  @IsNotEmpty({ message: 'The identifier must not be empty' })
  @Transform(({ value }) => value?.trim())
  identifier: string;

  @IsNotEmpty({ message: 'The password must not be empty' })
  @Transform(({ value }) => value?.trim())
  password: string;
}
