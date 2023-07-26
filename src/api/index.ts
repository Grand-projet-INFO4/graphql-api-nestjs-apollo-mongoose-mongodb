import { AuthModule } from './auth/auth.module';
import { CityModule } from './city/city.module';
import { RegionModule } from './region/region.module';
import { UserModule } from './user/user.module';

// Array of all the modules of the GraphQL API's resources
// It's facilitates the import of all these modules from other parts of the application
export const apiModules = [AuthModule, UserModule, RegionModule, CityModule];
