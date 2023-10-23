import { Args, Query, Resolver } from '@nestjs/graphql';

import { CityService } from '../city.service';
import {
  GetCitiesQueryFilters,
  QueryPagePaginationParams,
  QueryTextSearchParams,
} from 'src/graphql/schema';
import { SortParams } from 'src/common/types/query';

@Resolver('City')
export class CityResolver {
  constructor(private cityService: CityService) {}

  @Query('cities')
  async getCities(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('textSearch') textSearch: QueryTextSearchParams,
    @Args('filters') filters: GetCitiesQueryFilters,
    @Args('sort') sort: SortParams,
  ) {
    return this.cityService.get({
      ...pagination,
      ...textSearch,
      ...filters,
      ...sort,
    });
  }
}
