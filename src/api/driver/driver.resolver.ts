import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common/decorators';

import { DriverService } from './driver.service';
import {
  GetDriversQueryFilters,
  QueryPagePaginationParams,
  QuerySortParams,
  QueryTextSearchParams,
} from 'src/graphql/schema';
import { DriverLicenseCategory } from './driver';
import { ApplyPolicy, AuthUser } from '../auth/decorator';
import { DriverPolicy } from './driver.policy';
import { UserAction } from '../auth/auth.policy';
import { AccessTokenGuard } from '../auth/guard';
import { ReqAuthUser } from '../auth/auth';
import { Driver, DriverDocument } from './schema';
import { BindDriverIdArgPipe } from './pipe';
import { AppGqlContext } from 'src/graphql/context';

@Resolver('Driver')
export class DriverResolver {
  constructor(
    private driverService: DriverService,
    private driverPolicy: DriverPolicy,
  ) {}

  @Query('drivers')
  @ApplyPolicy(DriverPolicy, UserAction.Read, Driver)
  @UseGuards(AccessTokenGuard)
  async getDrivers(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('textSearch') textSearch: QueryTextSearchParams = {},
    @Args('filters') filters: GetDriversQueryFilters = {},
    @Args('sort') sort: QuerySortParams,
    @AuthUser() authUser: ReqAuthUser,
  ) {
    this.driverPolicy.authorize(authUser, UserAction.Read, {
      kind: 'DRIVER_FILTERS',
      cooperativeId: filters?.cooperativeId,
    });

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
  @UseGuards(AccessTokenGuard)
  async getDriver(
    @Args('identifier', BindDriverIdArgPipe) driver: DriverDocument,
    @AuthUser() authUser: ReqAuthUser,
  ) {
    this.driverPolicy.authorize(authUser, UserAction.Read, driver);
    return driver;
  }

  /**
   * The driver photo resolves to the full URL path of the photo
   */
  @ResolveField('photo')
  getPhoto(@Parent() driver: DriverDocument): string | null {
    return driver.photo
      ? this.driverService.getDriverPhotoURL(driver.photo)
      : null;
  }

  @ResolveField('cooperative')
  async getCooperative(
    @Parent() driver: DriverDocument,
    @Context() { loaders }: AppGqlContext,
  ) {
    if (!driver.cooperative) return null;
    return 'coopName' in driver.cooperative
      ? driver.cooperative
      : loaders.cooperativeLoader.cooperativeHavingId.load(driver.cooperative);
  }
}
