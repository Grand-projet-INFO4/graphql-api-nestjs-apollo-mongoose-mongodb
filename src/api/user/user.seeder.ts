import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';
import { Connection, mongo } from 'mongoose';

import { User, UserModel } from './schema';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { WithMongoId } from 'src/common/types/mongo-id';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import * as userSeedsOptions from '../../../seed/user.seed.json';
import { RemoveMethods } from 'src/common/types/utils';

export type UserSeederPayload = WithMongoId<
  Omit<RemoveMethods<User>, 'city'> & {
    city?: CitySeederPayload;
  }
>;

type UserSeedOptions = Omit<User, 'city'> & { cityName: string };

export class UserSeeder implements Seeder {
  // Users seed data as a singleton
  private static users: UserSeederPayload[] | null = null;

  // Map of username-payload as a singleton
  private static usernameMap: Map<string, UserSeederPayload> | null = null;

  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.userModel.insertMany(UserSeeder.getUsers());
    await session.commitTransaction();
    console.log('Seeded the `users` collection ...');
  }

  async drop() {
    if (!(await modelCollectionExists(this.userModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.db.dropCollection('users');
    await session.commitTransaction();
    console.log('Cleared the `users` collection ...');
  }

  /**
   * Getter of the users seed data singleton
   */
  static getUsers(): UserSeederPayload[] {
    if (!UserSeeder.users) {
      const cityMap = CitySeeder.getCityNameMap();
      const usersSeedsOptions = userSeedsOptions as UserSeedOptions[];
      const users = usersSeedsOptions.map<UserSeederPayload>((options) => {
        const user: UserSeederPayload = {
          _id: new mongo.ObjectId(),
          firstName: options.firstName,
          lastName: options.lastName,
          username: options.username,
          email: options.email,
          password: options.password,
          roles: options.roles,
        };
        options.phone && (user.phone = options.phone);
        options.photo && (user.photo = options.photo);
        if (options.cityName) {
          user.city = cityMap.get(options.cityName);
        }
        return user;
      });
      UserSeeder.users = users;
    }
    return UserSeeder.users;
  }

  /**
   * Getter for the username map singleton
   */
  static getUsernameMap() {
    if (!UserSeeder.usernameMap) {
      const usernameMap = new Map<string, UserSeederPayload>();
      const users = UserSeeder.getUsers();
      for (const user of users) {
        usernameMap.set(user.username, user);
      }
      UserSeeder.usernameMap = usernameMap;
    }
    return UserSeeder.usernameMap;
  }
}

// $2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu - password
