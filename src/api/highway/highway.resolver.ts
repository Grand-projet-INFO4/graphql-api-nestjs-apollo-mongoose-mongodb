import { Args, Query, Resolver } from '@nestjs/graphql';

import { HighwayService } from './highway.service';
import { QuerySortParams, QueryTextSearchParams } from 'src/graphql/schema';

@Resolver('Highway')
export class HighwayResolver {
  constructor(private highwayService: HighwayService) {}

  @Query('highways')
  async getHighways(
    @Args('textSearch') textSearch: QueryTextSearchParams | null = {},
    @Args('sort') sort: QuerySortParams | null,
  ) {
    return this.highwayService.get({
      ...textSearch,
      sortBy: sort?.sortBy ?? 'no',
      order: sort?.order ?? 'asc',
    });
  }

  @Query('highway')
  async getHighway(@Args('identifier') identifier: string) {
    return this.highwayService.getOne(identifier);
  }
}
