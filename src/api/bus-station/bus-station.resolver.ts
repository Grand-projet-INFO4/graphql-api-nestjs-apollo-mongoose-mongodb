import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { BusStationService } from './bus-station.service';
import {
  EmbeddedPhoto,
  GetBusStationsQueryFilters,
  QueryPagePaginationParams,
  QuerySortParams,
  QueryTextSearchParams,
} from 'src/graphql/schema';
import { BusStationDocument } from './schema';
import { BoundingsBoxInput } from 'src/common/types/geojson';

@Resolver('BusStation')
export class BusStationResolver {
  constructor(private busStationService: BusStationService) {}

  @Query('busStations')
  async getBusStations(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('textSearch') textSearch: QueryTextSearchParams = {},
    @Args('sort') sort?: QuerySortParams,
    @Args('filters') filters: GetBusStationsQueryFilters = {},
  ) {
    return this.busStationService.get({
      ...pagination,
      ...textSearch,
      ...filters,
      nearPoint: filters?.nearPoint as [number, number] | undefined,
      boundingsBox: filters?.boundingsBox as BoundingsBoxInput,
      sortBy: sort?.sortBy ?? 'updatedAt',
      order: sort?.order,
    });
  }

  /**
   * Custom resolver for the `photos` field.
   *
   * We need to define the resolver for this field because of the `url` virtual field for each photo.
   */
  @ResolveField('photos')
  getPhotos(@Parent() busStation: BusStationDocument): EmbeddedPhoto[] | null {
    if (!busStation.photos) return null;
    return busStation.photos.map<EmbeddedPhoto>((photo) => ({
      id: photo._id.toString(),
      filename: photo.filename,
      url: this.busStationService.getBusStationPhotoURL(photo.filename),
      description: photo?.description,
    }));
  }

  @ResolveField('mainPhoto')
  getMainPhotoURL(@Parent() busStation: BusStationDocument): string | null {
    if (!busStation.mainPhotoId) return null;
    const photo = busStation.photos?.find(
      (photo) => photo.id === busStation.mainPhotoId.toString(),
    );
    return photo
      ? this.busStationService.getBusStationPhotoURL(photo.filename)
      : null;
  }
}
