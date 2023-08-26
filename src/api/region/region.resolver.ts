import { Args, Query, Resolver } from '@nestjs/graphql';

import { RegionService } from './region.service';
import { GetRegionsQueryFilters, QuerySortParams } from 'src/graphql/schema';

@Resolver('Region')
export class RegionResolver {
  constructor(private regionService: RegionService) {}

  @Query('regions')
  async getRegions(
    @Args('filters') filters: GetRegionsQueryFilters,
    @Args('sort') sort: QuerySortParams,
  ) {
    return this.regionService.get({
      ...filters,
      ...sort,
    });
  }
}
