import { Args, Query, Resolver } from '@nestjs/graphql';

import { BookingService } from './booking.service';
import {
  GetBookingsQueryFilters,
  QueryPagePaginationParams,
  QuerySortParams,
  QueryTextSearchParams,
} from 'src/graphql/schema';
import { BookingMode } from './booking.constants';

@Resolver('Booking')
export class BookingResolver {
  constructor(private bookingService: BookingService) {}

  @Query('bookings')
  async getBookings(
    @Args('pagination') pagination: QueryPagePaginationParams,
    @Args('sort') sort?: QuerySortParams,
    @Args('textSearch') textSearch?: QueryTextSearchParams,
    @Args('filters') filters?: GetBookingsQueryFilters,
  ) {
    return this.bookingService.get({
      ...pagination,
      ...sort,
      ...textSearch,
      ...filters,
      mode: filters?.mode as unknown as BookingMode,
    });
  }
}
