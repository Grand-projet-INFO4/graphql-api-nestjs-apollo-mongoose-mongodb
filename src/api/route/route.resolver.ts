import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { RouteService } from './route.service';
import {
  GetRoutesQueryFilters,
  QueryPagePaginationParams,
  QuerySortParams,
} from 'src/graphql/schema';
import { RouteDocument } from './schema';

@Resolver('Route')
export class RouteResolver {
  constructor(private routeService: RouteService) {}

  @Query('routes')
  async getRoutes(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('sort') sort?: QuerySortParams,
    @Args('filters') filters?: GetRoutesQueryFilters,
  ) {
    return this.routeService.get({
      ...pagination,
      ...sort,
      ...filters,
    });
  }

  /**
   * Id field resolver
   */
  @ResolveField('id')
  getId(@Parent() route: RouteDocument) {
    return route._id.toString();
  }
}
