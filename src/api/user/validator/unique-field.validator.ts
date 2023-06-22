import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';

import { UniqueFieldValidator } from 'src/common/validators';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueUserFieldValidator extends UniqueFieldValidator {
  constructor(private prisma: PrismaService) {
    super();
  }

  async checkUnique(
    field: 'id' | 'email' | 'username',
    value: string,
  ): Promise<boolean> {
    return (await this.prisma.user.count({ where: { [field]: value } })) === 0;
  }
}
