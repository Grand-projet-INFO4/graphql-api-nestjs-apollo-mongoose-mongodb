import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Route, routeSchema } from './schema';

const routeMongooseModule = MongooseModule.forFeature([
  {
    name: Route.name,
    schema: routeSchema,
  },
]);

@Module({
  imports: [routeMongooseModule],
  exports: [routeMongooseModule],
})
export class RouteModule {}
