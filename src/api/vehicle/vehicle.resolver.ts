import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { VehicleService } from './vehicle.service';
import {
  EmbeddedPhoto,
  GetVehiclesQueryFilters,
  QueryPagePaginationParams,
  QuerySortParams,
} from 'src/graphql/schema';
import { BoundingsBoxInput } from 'src/common/types/geojson';
import { VehicleDocument } from './schema';

@Resolver('Vehicle')
export class VehicleResolver {
  constructor(private vehicleService: VehicleService) {}

  @Query('vehicles')
  async getVehicles(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('sort') sort?: QuerySortParams,
    @Args('filters') filters?: GetVehiclesQueryFilters,
  ) {
    return this.vehicleService.get({
      ...pagination,
      ...sort,
      ...filters,
      nearPoint: filters?.nearPoint as [number, number],
      boundingsBox: filters?.boundingsBox as BoundingsBoxInput,
    });
  }

  /**
   * Photos field resolver.
   *
   * It used to append full URL to photos.
   */
  @ResolveField('photos')
  getPhotos(@Parent() vehicle: VehicleDocument): EmbeddedPhoto[] | null {
    if (!vehicle.photos) return null;
    return vehicle.photos.map((photo) => ({
      id: photo._id.toString(),
      filename: photo.filename,
      url: this.vehicleService.getVehiclePhotoURL(photo.filename),
      description: photo.description,
    }));
  }

  /**
   * Main photo field resolver
   */
  @ResolveField('mainPhoto')
  getMainPhoto(@Parent() vehicle: VehicleDocument): EmbeddedPhoto | null {
    if (!vehicle.mainPhotoId) return null;
    const photoDoc = vehicle.photos?.find(
      (photo) => vehicle.mainPhotoId.toString() === photo.id,
    );
    if (!photoDoc) return null;
    return {
      id: photoDoc._id.toString(),
      filename: photoDoc.filename,
      url: this.vehicleService.getVehiclePhotoURL(photoDoc.filename),
      description: photoDoc.description,
    };
  }
}
