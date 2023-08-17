import { Seeder } from 'nestjs-seeder';
import { Connection, mongo } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import {
  CAR_MODEL_COLLECTION,
  CarModel,
  CarModelModel,
} from '../car-model/schema';
import { WithMongoId } from 'src/common/types/mongo-id';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';

export type CardModelSeederPayload = WithMongoId<CarModel>;

export class CarModelSeeder implements Seeder {
  // Car models seed data payload
  private static carModels: CardModelSeederPayload[] | null = null;

  // Map of car model and brand combination key and car model seed data value
  private static carModelsMap: Map<string, CardModelSeederPayload> | null =
    null;

  constructor(
    @InjectModel(CarModel.name) private carModelModel: CarModelModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.carModelModel.insertMany(CarModelSeeder.getCarModels());
    await session.commitTransaction();
    console.log(`Seeded the \`${CAR_MODEL_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.carModelModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(CAR_MODEL_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${CAR_MODEL_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the car models seed data singleton
   */
  static getCarModels() {
    if (!CarModelSeeder.carModels) {
      const carModels: CardModelSeederPayload[] = [
        {
          _id: new mongo.ObjectId(),
          brand: 'Mercedes-benz',
          modelName: 'Sprinter 312 d',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Mercedes-benz',
          modelName: 'Sprinter 311 cdi',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Mercedes-benz',
          modelName: 'Sprinter 413 cdi',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Mercedes-benz',
          modelName: 'Sprinter 419 cdi',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Mercedes-benz',
          modelName: 'Sprinter 524 cdi',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Volkswagen',
          modelName: 'Crafter',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'VDL Bova',
          modelName: 'Futura',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Neoplan',
          modelName: 'N 316 K',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Neoplan',
          modelName: 'Skyliner',
        },
        {
          _id: new mongo.ObjectId(),
          brand: 'Toyota',
          modelName: 'HiAce Premio 2.8',
        },
      ];
      CarModelSeeder.carModels = carModels;
    }
    return CarModelSeeder.carModels;
  }

  /**
   * Generates a key for the car models map from a card brand and a car model keys
   */
  static generateCarModelsMapKey(keys: { brand: string; modelName: string }) {
    return `${keys.brand} - ${keys.modelName}`;
  }

  /**
   * Getter for the car models map singleton
   */
  static getCarModelsMap() {
    if (!CarModelSeeder.carModelsMap) {
      const carModelsMap = new Map<string, CardModelSeederPayload>();
      for (const carModel of CarModelSeeder.getCarModels()) {
        const key = CarModelSeeder.generateCarModelsMapKey({
          brand: carModel.brand,
          modelName: carModel.modelName,
        });
        carModelsMap.set(key, carModel);
      }
      CarModelSeeder.carModelsMap = carModelsMap;
    }
    return CarModelSeeder.carModelsMap;
  }

  /**
   * Gets a car model seed data from the map
   */
  static getCarModelSeedDataFromMap(keys: {
    brand: string;
    modelName: string;
  }) {
    const key = CarModelSeeder.generateCarModelsMapKey({
      brand: keys.brand,
      modelName: keys.modelName,
    });
    return CarModelSeeder.getCarModelsMap().get(key);
  }
}
