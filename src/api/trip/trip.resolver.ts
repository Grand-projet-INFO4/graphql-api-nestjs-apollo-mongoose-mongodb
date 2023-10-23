import { Args, Query, Resolver } from '@nestjs/graphql';
import { TripService } from './trip.service';
import {
  GetTripsFilters,
  QueryPagePaginationParams,
  QuerySortParams,
} from 'src/graphql/schema';
import { TripStatus } from './trip.constants';

@Resolver('Trip')
export class TripResolver {
  constructor(private tripService: TripService) {}

  @Query('trips')
  async getPlannedTrips(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('sort') sort?: QuerySortParams,
    @Args('filters') filters?: GetTripsFilters,
  ) {
    return this.tripService.get({
      ...pagination,
      ...sort,
      ...filters,
      status: filters?.status as unknown as TripStatus,
    });
  }
}
