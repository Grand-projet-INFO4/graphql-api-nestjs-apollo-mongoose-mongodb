import { Args, Query, Resolver } from '@nestjs/graphql';

import { ParkingLotService } from './parking-lot.service';
import {
  QueryPagePaginationParams,
  QuerySortParams,
  GetParkingLotsQueryFilters,
} from 'src/graphql/schema';
import { BoundingsBoxInput } from 'src/common/types/geojson';

@Resolver('ParkingLot')
export class ParkingLotResolver {
  constructor(private parkingLotService: ParkingLotService) {}

  @Query('parkingLots')
  async getParkingLots(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('sort') sort: QuerySortParams,
    @Args('filters') filters: GetParkingLotsQueryFilters,
  ) {
    return this.parkingLotService.get({
      ...pagination,
      ...sort,
      ...filters,
      nearPoint: filters.nearPoint as [number, number],
      boundingsBox: filters.boundingsBox as BoundingsBoxInput,
    });
  }
}
