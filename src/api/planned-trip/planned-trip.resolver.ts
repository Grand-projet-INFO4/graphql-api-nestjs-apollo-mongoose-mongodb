import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { PlannedTripService } from './planned-trip.service';
import {
  GetPlannedTripsFilters,
  QueryPagePaginationParams,
  QuerySortParams,
} from 'src/graphql/schema';
import { PlannedTripStatus } from './planned-trip.constants';
import { PlannedTripDocument } from './schema';

@Resolver('PlannedTrip')
export class PlannedTripResolver {
  constructor(private plannedTripService: PlannedTripService) {}

  @Query('plannedTrips')
  async getPlannedTrips(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('sort') sort?: QuerySortParams,
    @Args('filters') filters?: GetPlannedTripsFilters,
  ) {
    return this.plannedTripService.get({
      ...pagination,
      ...sort,
      ...filters,
      status: filters?.status as unknown as PlannedTripStatus,
    });
  }

  /**
   * Count of available seats field resolver
   */
  @ResolveField('availSeatsCount')
  getAvailableSeatsCount(@Parent() plannedTrip: PlannedTripDocument) {
    return this.plannedTripService.countAvailableSeats(plannedTrip);
  }
}
