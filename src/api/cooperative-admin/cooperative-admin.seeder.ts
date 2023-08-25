import { Seeder } from 'nestjs-seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';

import {
  COOPERATIVE_ADMIN_COLLECTION,
  CooperativeAdmin,
  CooperativeAdminModel,
} from './schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import * as coopAdminsSeedOptions from '../../../seed/cooperative-admin.seed.json';
import { UserRole } from '../user/user.constants';
import { UserSeeder } from '../user/user.seeder';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';

export type CooperativeAdminSeederPayload = WithMongoId<
  ReplaceFields<
    CooperativeAdmin,
    { user: mongo.BSON.ObjectId; cooperative: mongo.BSON.ObjectId }
  >
>;

export class CooperativeAdminSeeder implements Seeder {
  // Singleton of cooperative admins seed data
  private static cooperativeAdmins: CooperativeAdminSeederPayload[] | null =
    null;

  constructor(
    @InjectModel(CooperativeAdmin.name)
    private cooperativeAdminModel: CooperativeAdminModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.cooperativeAdminModel.insertMany(
      CooperativeAdminSeeder.getCooperativeAdmins(),
    );
    await session.commitTransaction();
    console.log(
      `Seeded the \`${COOPERATIVE_ADMIN_COLLECTION}\` collection ...`,
    );
  }

  async drop() {
    if (!(await modelCollectionExists(this.cooperativeAdminModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection(COOPERATIVE_ADMIN_COLLECTION);
    await session.commitTransaction();
    console.log(
      `Cleared the \`${COOPERATIVE_ADMIN_COLLECTION}\` collection ...`,
    );
  }

  /**
   * Getter for the cooperative admins seed data singleton
   */
  static getCooperativeAdmins() {
    if (!CooperativeAdminSeeder.cooperativeAdmins) {
      const userMap = UserSeeder.getUsernameMap();
      const cooperativeMap = CooperativeSeeder.getCooperativesSlugMap();
      const cooperativeAdmins =
        coopAdminsSeedOptions.map<CooperativeAdminSeederPayload>((options) => ({
          _id: new mongo.ObjectId(),
          role: UserRole.Manager,
          user: userMap.get(options.username)._id,
          cooperative: cooperativeMap.get(options.cooperativeSlug)._id,
        }));
      CooperativeAdminSeeder.cooperativeAdmins = cooperativeAdmins;
    }
    return CooperativeAdminSeeder.cooperativeAdmins;
  }
}
