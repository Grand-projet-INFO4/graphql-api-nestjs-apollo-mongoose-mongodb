import { Args, Query, Resolver } from '@nestjs/graphql';

import { DriverService } from './driver.service';
import {
  GetDriversQueryFilters,
  QueryPagePaginationParams,
  QuerySortParams,
  QueryTextSearchParams,
} from 'src/graphql/schema';
import { DriverLicenseCategory } from './driver';

@Resolver('Driver')
export class DriverResolver {
  constructor(private driverService: DriverService) {}

  @Query('drivers')
  async getDrivers(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('textSearch') textSearch: QueryTextSearchParams = {},
    @Args('filters') filters: GetDriversQueryFilters = {},
    @Args('sort') sort: QuerySortParams,
  ) {
    return this.driverService.get({
      ...pagination,
      ...textSearch,
      ...filters,
      licenseCategories: filters.licenseCategories as
        | DriverLicenseCategory[]
        | undefined,
      sortBy: sort?.sortBy ?? 'hiredAt',
      order: sort?.order ?? 'desc',
    });
  }

  @Query('driver')
  async getDriver(@Args('identifier') identifier: string) {
    return this.driverService.getOne(identifier);
  }
}
