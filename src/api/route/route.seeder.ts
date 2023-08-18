import { Seeder } from 'nestjs-seeder';
import { mongo } from 'mongoose';
import { Connection } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { ROUTE_COLLECTION, Route, RouteModel } from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { ParkingLotSeeder } from '../parking-lot/parking-lot.seeder';
import * as routeSeeds from '../../../seed/route.seed.json';

export type RouteSeederPayload = WithMongoId<
  ReplaceFields<
    Route,
    {
      cooperative: mongo.BSON.ObjectId;
      parkingLots: mongo.BSON.ObjectId[];
    }
  >
>;

type CooperativeRoutesSeed = Omit<Route, 'cooperative' | 'parkingLots'> & {
  parkingLotsAddresses: string[];
};

type CooperativeRoutesSeedOptions = {
  cooperativeSlug: string;
  routes: CooperativeRoutesSeed[];
};

export class RouteSeeder implements Seeder {
  // Routes seed data singleton
  private static routes: RouteSeederPayload[] | null = null;

  constructor(
    @InjectModel(Route.name) private routeModel: RouteModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.routeModel.insertMany(RouteSeeder.getRoutes());
    await session.commitTransaction();
    console.log('Seeded the `' + ROUTE_COLLECTION + '` collection ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.routeModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection(ROUTE_COLLECTION);
    await session.commitTransaction();
    console.log('Cleared the `' + ROUTE_COLLECTION + '` collection ...');
  }

  /**
   * Getter for the routes seed data singleton
   */
  static getRoutes() {
    if (!RouteSeeder.routes) {
      const cooperativeMap = CooperativeSeeder.getCooperativesSlugMap();
      const routes: RouteSeederPayload[] = [];
      const coopRoutesSeedOptions: CooperativeRoutesSeedOptions[] = routeSeeds;
      for (const options of coopRoutesSeedOptions) {
        for (const routeSeed of options.routes) {
          const cooperativeId = cooperativeMap.get(options.cooperativeSlug)._id;
          const parkingLotsIds =
            routeSeed.parkingLotsAddresses.map<mongo.BSON.ObjectId>(
              (address) => {
                return ParkingLotSeeder.getParkingLotSeedFromMap({
                  cooperativeId,
                  address,
                })._id;
              },
            );
          const route: RouteSeederPayload = {
            _id: new mongo.ObjectId(),
            fee: routeSeed.fee,
            approxDuration: routeSeed.approxDuration,
            maxDuration: routeSeed.maxDuration,
            distance: routeSeed.distance,
            highways: routeSeed.highways,
            cooperative: cooperativeId,
            parkingLots: parkingLotsIds,
          };
          routes.push(route);
        }
      }
      RouteSeeder.routes = routes;
    }
    return RouteSeeder.routes;
  }
}
