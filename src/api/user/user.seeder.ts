import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Seeder } from 'nestjs-seeder';
import { User, UserModel } from './schema';
import { Connection, mongo } from 'mongoose';
import { CitySeeder, CitySeederPayload } from '../city/city.seeder';
import { WithMongoId } from 'src/common/types/mongo-id';
import { UserRole } from './user.constants';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';

export type UserSeederPayload = WithMongoId<
  Omit<User, 'city'> & {
    city?: CitySeederPayload;
  }
>;

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
      const users: UserSeederPayload[] = [
        {
          _id: new mongo.ObjectId(),
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          photo: 'johndoe.jpg',
          email: 'johndoe@gmail.com',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.SuperAdmin],
        },
        {
          _id: new mongo.ObjectId(),
          firstName: 'Tolojanahary Fenomanantsoa',
          lastName: 'RABEFALY',
          username: 'amazing_tool',
          photo: 'tolotra.jpg',
          email: 'tolotrarabefaly@gmail.com',
          phone: '+261324924506',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.Admin],
        },
        {
          _id: new mongo.ObjectId(),
          firstName: 'Ny Aina Fitiavana',
          lastName: 'RABARIMAHEFA',
          username: 'bari.69877',
          photo: 'fitiavana.jpg',
          email: 'fitiavanarabariahefa@gmail.com',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.Admin],
        },
        {
          _id: new mongo.ObjectId(),
          firstName: 'Kiadiniaina Estello',
          lastName: 'MAHANDRIARIVELO',
          username: 'kiadyestello.4561',
          photo: 'kiady.jpg',
          email: 'kiadyestello@gmail.com',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.Admin],
        },
        {
          _id: new mongo.ObjectId(),
          firstName: 'Dimbinirina Martin',
          lastName: 'ANDRIANOMENJANAHARY',
          username: 'thintin.X',
          photo: 'martin.jpg',
          email: 'thintin@gmail.com',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.Admin],
        },
        {
          _id: new mongo.ObjectId(),
          firstName: 'Cédrick',
          lastName: 'TARIKA',
          username: 'ced.rick',
          photo: 'cedric.jpg',
          email: 'tarikacedrick@gmail.com',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.Admin],
        },
        {
          _id: new mongo.ObjectId(),
          firstName: 'Ranto Billy',
          lastName: 'ANDRIANARIVELO',
          username: 'ranto.billy',
          photo: 'billy.jpg',
          email: 'rantobilly@gmail.com',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.Admin],
        },
        {
          _id: new mongo.ObjectId(),
          firstName: 'Tanjona Harintsarobidy',
          lastName: 'RAJAOLIARIBENJA',
          username: '_tanjona_',
          photo: 'tanjona.jpg',
          email: 'tanjonaharints@gmail.com',
          password:
            '$2b$10$kZl2CGCDgFA9y7YXADJu5engg5tN0lNM.kBjHm97KZKhgUEnUwFGu', // Clear text: password
          city: CitySeeder.getCityNameMap().get('Antananarivo'),
          roles: [UserRole.Basic, UserRole.Admin],
        },
      ];
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
