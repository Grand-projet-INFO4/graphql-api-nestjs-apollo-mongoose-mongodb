import { Injectable, PipeTransform } from '@nestjs/common';

import { DriverService } from '../driver.service';

@Injectable()
export class BindDriverIdArgPipe implements PipeTransform {
  constructor(private driverService: DriverService) {}

  async transform(identifier: string) {
    const driver = await this.driverService.getOne(identifier);
    return driver;
  }
}
