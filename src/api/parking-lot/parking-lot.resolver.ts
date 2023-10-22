import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Types } from 'mongoose';

import { ParkingLotService } from './parking-lot.service';
import {
  QueryPagePaginationParams,
  QuerySortParams,
  GetParkingLotsQueryFilters,
} from 'src/graphql/schema';
import { BoundingsBoxInput } from 'src/common/types/geojson';
import { ParkingLotDocument } from './schema';
import { AppGqlContext } from 'src/graphql/context';

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

  /**
   * Id field resolver
   */
  @ResolveField('id')
  getId(@Parent() parkingLot: ParkingLotDocument) {
    return parkingLot._id.toString();
  }

  /**
   * Main photo field resolver
   */
  @ResolveField('mainPhoto')
  getMainPhoto(
    @Parent() parkingLot: ParkingLotDocument,
    @Context() ctx: AppGqlContext,
  ) {
    if (!parkingLot.mainPhoto) return null;
    if ('filename' in parkingLot.mainPhoto) return parkingLot.mainPhoto;
    return ctx.loaders.photoLoader.cooperativePhotoHavingId.load(
      parkingLot.mainPhoto,
    );
  }

  /**
   * Main photo field resolver
   */
  @ResolveField('busStation')
  getBusStation(
    @Parent() parkingLot: ParkingLotDocument,
    @Context() ctx: AppGqlContext,
  ) {
    if (!parkingLot.busStation) return null;
    if ('address' in parkingLot.busStation) return parkingLot.busStation;
    return ctx.loaders.busStationLoader.busStationHavingId.load(
      parkingLot.busStation as Types.ObjectId,
    );
  }
}
