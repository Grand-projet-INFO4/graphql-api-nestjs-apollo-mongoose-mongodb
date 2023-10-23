import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Route, routeSchema } from './schema';
import { RouteResolver } from './route.resolver';
import { RouteService } from './route.service';

const routeMongooseModule = MongooseModule.forFeature([
  {
    name: Route.name,
    schema: routeSchema,
  },
]);

@Module({
  imports: [routeMongooseModule],
  providers: [RouteResolver, RouteService],
  exports: [routeMongooseModule, RouteService],
})
export class RouteModule {}
