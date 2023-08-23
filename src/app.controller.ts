import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('')
  index(): string {
    return `
    <h1>This is the Zaha-dia app's backend.</h1>
    <p>If you want to access the resources, please point the routes available.</p>
  `;
  }
}
