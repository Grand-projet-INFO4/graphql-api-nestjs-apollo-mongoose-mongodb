import { Seeder } from 'nestjs-seeder';
import { Connection, mongo } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { VEHICLE_COLLECTION, Vehicle, VehicleModel } from './schema';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';
import { WithMongoId } from 'src/common/types/mongo-id';
import { ReplaceFields } from 'src/common/types/utils';
import { EmbeddedPhotoSeed } from '../photo/photo';
import { EmbeddedTrackingDeviceSeed } from '../tracking-device/tracking-device';
import { CarModelSeeder } from '../car-model/car-model.seeder';
import { EmbeddedCarModelSeed } from '../car-model/car-model';
import { VehicleState, VehicleStatus } from './vehicle.constants';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { DriverSeeder } from '../driver/driver.seeder';

export type VehicleSeederPayload = WithMongoId<
  ReplaceFields<
    Vehicle,
    {
      mainPhotoId?: mongo.BSON.ObjectId;
      photos?: EmbeddedPhotoSeed[];
      tracker?: EmbeddedTrackingDeviceSeed;
      model: EmbeddedCarModelSeed;
      cooperative: mongo.BSON.ObjectId;
      ongoingTrip?: mongo.BSON.ObjectId;
      drivers?: mongo.BSON.ObjectId[];
    }
  >
>;

type CooperativeVehiclesSeedOptions = {
  cooperativeId: mongo.BSON.ObjectId;
  vehicles: ReplaceFields<
    Omit<
      VehicleSeederPayload,
      '_id' | 'cooperative' | 'mainPhotoId' | 'drivers'
    >,
    {
      mainPhoto?: string;
      photos?: string[];
      model: {
        modelName: string;
        brand: string;
      };
      driversKeys?: { firstName: string; lastName: string }[];
    }
  >[];
};

/**
 * Generates the main photo id and the photos of a vehicle seed data from a main photo and photos filenames
 */
function generateVehiclePhotosSeed(mainPhoto: string, photos: string[]) {
  let mainPhotoId: mongo.BSON.ObjectId;
  const _photos: EmbeddedPhotoSeed[] = [];
  for (const photo of photos) {
    const _photo: EmbeddedPhotoSeed = {
      _id: new mongo.ObjectId(),
      filename: photo,
    };
    if (photo === mainPhoto) {
      mainPhotoId = _photo._id;
    }
  }
  return {
    mainPhotoId,
    photos: _photos,
  };
}

export class VehicleSeeder implements Seeder {
  // Vehicles seed data singleton
  private static vehicles: VehicleSeederPayload[] | null = null;

  // Map of vehicle plate id key and vehicle seed data value singleton
  private static vehicleMap: Map<string, VehicleSeederPayload> | null = null;

  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: VehicleModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.vehicleModel.insertMany(VehicleSeeder.getVehicles());
    await session.commitTransaction();
    console.log(`Seeded the \`${VEHICLE_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.vehicleModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(VEHICLE_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${VEHICLE_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the vehicles seed data singleton
   */
  static getVehicles() {
    if (!VehicleSeeder.vehicles) {
      const cooperativeMap = CooperativeSeeder.getCooperativesSlugMap();
      const vehiclesByCooperativeOptions: CooperativeVehiclesSeedOptions[] = [
        {
          cooperativeId: cooperativeMap.get('trans-vatsi')._id,
          vehicles: [
            {
              plateId: '4538 TBJ',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 419 cdi',
              },
              mainPhoto: '2017-09-30(4).jpg',
              photos: ['2017-09-30(4).jpg', '2017-09-30(3).jpg'],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              driversKeys: [
                {
                  firstName: 'Franklin',
                  lastName: 'RABEARISOA',
                },
              ],
            },
            {
              plateId: '8593 TBS',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 419 cdi',
              },
              mainPhoto: '361937635_2342348319294057_2290754640785537267_n.jpg',
              photos: [
                '361937635_2342348319294057_2290754640785537267_n.jpg',
                '358133873_2342348172627405_5510737819643780889_n.jpg',
              ],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              driversKeys: [
                {
                  firstName: 'Princy',
                  lastName: 'RAKOTOVAO',
                },
              ],
            },
            {
              plateId: '3338 TAL',
              model: {
                brand: 'Neoplan',
                modelName: 'Skyliner',
              },
              mainPhoto: '1690835246080.jpg',
              photos: ['1690835246080.jpg'],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 1,
                rearCols: 4,
                rearRows: 17,
              },
              removedSeats: ['143', '144', '33', '34'],
              driversKeys: [
                {
                  firstName: 'Tsiky',
                  lastName: 'NAMBINITSOA',
                },
              ],
            },
            {
              plateId: '1838 TAV',
              model: {
                brand: 'Neoplan',
                modelName: 'N 316 K',
              },
              mainPhoto: '1690835267202.jpg',
              photos: ['1690835267202.jpg', '1690835251707.jpg'],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 1,
                rearCols: 4,
                rearRows: 12,
              },
              removedSeats: ['63', '64'],
              driversKeys: [
                {
                  firstName: 'Fenosoa',
                  lastName: 'RAKOTONDRASOA',
                },
              ],
            },
            {
              plateId: '5638 TAN',
              model: {
                brand: 'VDL Bova',
                modelName: 'Futura',
              },
              mainPhoto: '1690835271917.jpg',
              photos: ['1690835271917.jpg', '1690835258648.jpg'],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 1,
                rearCols: 4,
                rearRows: 12,
              },
              removedSeats: ['36', '64'],
              driversKeys: [
                { firstName: 'Fitiavana', lastName: 'ANDRIANARISOA' },
              ],
            },
            {
              plateId: '9527 TAK',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 413 cdi',
              },
              mainPhoto: 'vatsi-2.PNG',
              photos: ['vatsi-2.PNG', 'Capture.PNG'],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 1,
                rearCols: 4,
                rearRows: 12,
              },
              driversKeys: [
                {
                  firstName: 'Mickael',
                  lastName: 'ANDRIAKOTOSOA',
                },
              ],
            },
            {
              plateId: '5838 TAR',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 413 cdi',
              },
              mainPhoto: 'vatsi-6.PNG',
              photos: ['vatsi-6.PNG', 'vatsi-3.PNG'],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 1,
                rearCols: 4,
                rearRows: 5,
              },
              driversKeys: [
                {
                  firstName: 'Tahiriniaina',
                  lastName: 'RABESANDRATANA',
                },
              ],
            },
            {
              plateId: '1238 TBA',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 419 cdi',
              },
              mainPhoto: 'image_0991426_20141215_ob_88cad9_at2.jpg',
              photos: [
                'image_0991426_20141215_ob_88cad9_at2.jpg',
                'image_0991426_20141215_ob_a96597_at1.jpg',
              ],
              status: VehicleStatus.InUse,
              state: VehicleState.Operational,
              seatsCount: {
                front: 1,
                rearCols: 4,
                rearRows: 5,
              },
              driversKeys: [
                {
                  firstName: 'Rivosoa',
                  lastName: 'ANDRIMANJAKA',
                },
              ],
            },
          ],
        },
        {
          cooperativeId: cooperativeMap.get('kofmad')._id,
          vehicles: [
            {
              plateId: '3180 ME',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 524 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 6,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '357404195_2326276800901209_3894937706265522853_n.jpg',
              photos: ['357404195_2326276800901209_3894937706265522853_n.jpg'],
              driversKeys: [
                {
                  firstName: 'Vincent',
                  lastName: 'RAKOTONIRINA',
                },
              ],
            },
            {
              plateId: '2675 MF',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 524 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 6,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '361561751_229439823379676_2853897464811296680_n.jpg',
              photos: ['361561751_229439823379676_2853897464811296680_n.jpg'],
              driversKeys: [
                {
                  firstName: 'Zatovo',
                  lastName: 'BAKONIRINA',
                },
              ],
            },
            {
              plateId: '1882 TBS',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 419 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '314960707_1420075685066887_1124560147138977036_n.jpg',
              photos: ['314960707_1420075685066887_1124560147138977036_n.jpg'],
              driversKeys: [
                {
                  firstName: 'Marcelo',
                  lastName: 'MALALANIRINA',
                },
              ],
            },
            {
              plateId: '4219 ME',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 524 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '347561711_1081038336595195_7253242484905345232_n.jpg',
              photos: ['347561711_1081038336595195_7253242484905345232_n.jpg'],
              driversKeys: [
                {
                  firstName: 'Lovasoa',
                  lastName: 'RANDRIAMANJAKA',
                },
              ],
            },
            {
              plateId: '5826 MT',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 311 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '313261228_482982170595090_6688625559651366797_n.jpg',
              photos: ['313261228_482982170595090_6688625559651366797_n.jpg'],
              driversKeys: [
                {
                  firstName: 'Heriniaina',
                  lastName: 'ANDRIATSARAFARA',
                },
              ],
            },
            {
              plateId: '7303 TBR',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 311 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '310134778_101332816102076_4531218347023074044_n.jpg',
              photos: ['310134778_101332816102076_4531218347023074044_n.jpg'],
              driversKeys: [
                {
                  firstName: 'Mathieu',
                  lastName: 'SOLOFONIRINA',
                },
              ],
            },
            {
              plateId: '8586 TBH',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 419 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '1690835166412.jpg',
              photos: [
                '1690835166412.jpg',
                '1690835161341.jpg',
                '1690835163545.jpg',
                '1690835173086.jpg',
              ],
              driversKeys: [
                {
                  firstName: 'Bryan',
                  lastName: 'RANDRIANARISON',
                },
              ],
            },
            {
              plateId: '7683 ME',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              mainPhoto: '1690835191817.jpg',
              photos: [
                '1690835191817.jpg',
                '1690835194627.jpg',
                '1690835197291.jpg',
                '1690835199805.jpg',
              ],
              driversKeys: [
                {
                  firstName: 'Kiady',
                  lastName: 'RANDRIAMANALINA',
                },
              ],
            },
          ],
        },
        {
          cooperativeId: cooperativeMap.get('kofimanga-plus')._id,
          vehicles: [
            {
              plateId: '2946 TBK',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              mainPhoto: '1690834712540.jpg',
              photos: [
                '1690834712540.jpg',
                '1690834730723.jpg',
                '1690834736990.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Fanasina',
                  lastName: 'RAVONIA',
                },
              ],
            },
            {
              plateId: '6511 TAR',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 413 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 6,
              },
              mainPhoto: '1690834727592.jpg',
              photos: ['1690834727592.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Barisoa',
                  lastName: 'FANJAKA',
                },
              ],
            },
            {
              plateId: '8261 TBK',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 311 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              mainPhoto: '1690834744520.jpg',
              photos: ['1690834744520.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Vonia',
                  lastName: 'ANDRIAMBOLOLONA',
                },
              ],
            },
            {
              plateId: '9733 TBM',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              mainPhoto: '1690834741099.jpg',
              photos: ['1690834741099.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Tiana',
                  lastName: 'RAZAFIMAHATRATRA',
                },
              ],
            },
            {
              plateId: '9692 TBM',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 6,
              },
              mainPhoto: '122191478_970696466759031_5916841583114839128_n.jpg',
              photos: ['122191478_970696466759031_5916841583114839128_n.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Faly',
                  lastName: 'RANDRIAMAMONJY',
                },
              ],
            },
            {
              plateId: '8700 TBD',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 311 cdi',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              mainPhoto: '311597012_2056704994529377_208049986477488701_n.jpg',
              photos: ['311597012_2056704994529377_208049986477488701_n.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Marina',
                  lastName: 'RASOANINDRAINY',
                },
              ],
            },
          ],
        },
        {
          cooperativeId: cooperativeMap.get('transam_plus')._id,
          vehicles: [
            {
              plateId: '5869 TBP',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '245372567_112741294521193_5833136802894196309_n.jpg',
              photos: [
                '245372567_112741294521193_5833136802894196309_n.jpg',
                '1690834354341.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Zara',
                  lastName: 'RANDRIAMANANA',
                },
              ],
            },
            {
              plateId: '9635 TDB',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '274149515_4892502330829313_6236083358359353092_n.jpg',
              photos: [
                '274149515_4892502330829313_6236083358359353092_n.jpg',
                '361185536_255476357224730_6293434017835313833_n.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Aina',
                  lastName: 'RAKOTONDRANARY',
                },
              ],
            },
            {
              plateId: '9836 TAR',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '245372567_112741294521193_5833136802894196309_n.jpg',
              photos: [
                '245372567_112741294521193_5833136802894196309_n.jpg',
                '1690834354341.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Tojo',
                  lastName: 'RAJAONARIMANANA',
                },
              ],
            },
            {
              plateId: '1348 TP',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '274149515_4892502330829313_6236083358359353092_n.jpg',
              photos: [
                '274149515_4892502330829313_6236083358359353092_n.jpg',
                '361185536_255476357224730_6293434017835313833_n.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Mamy',
                  lastName: 'RANDRIANOMENA',
                },
              ],
            },
          ],
        },
        {
          cooperativeId: cooperativeMap.get('soatrans_plus')._id,
          vehicles: [
            {
              plateId: '0577 TBV',
              model: {
                brand: 'Mercedes-benz',
                modelName: 'Sprinter 312 d',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '1690834859679.jpg',
              photos: [
                '1690834859679.jpg',
                '1690834873417.jpg',
                '1690834852800.jpg',
                '1690834867414.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Zara',
                  lastName: 'ANDRIATSIFERANA',
                },
              ],
            },
            {
              plateId: '9171 TBM',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '217856582_124376389867923_2959297201132534310_n.jpg',
              photos: ['217856582_124376389867923_2959297201132534310_n.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Aina',
                  lastName: 'RAKOTONDRAVONJY',
                },
              ],
            },
            {
              plateId: '1724 TBS',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '357499202_257341737038192_5574194042917059395_n.jpg',
              photos: ['357499202_257341737038192_5574194042917059395_n.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Tojo',
                  lastName: 'RAJAONARIVELO',
                },
              ],
            },
            {
              plateId: '5402 TBN',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '355505347_240126752093024_3318866699022783404_n.jpg',
              photos: ['355505347_240126752093024_3318866699022783404_n.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Mamy',
                  lastName: 'RANDRIAHASINA',
                },
              ],
            },
            {
              plateId: '7677 TBP',
              model: {
                brand: 'Volkswagen',
                modelName: 'Crafter',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 5,
              },
              removedSeats: ['23', '33', '43'],
              mainPhoto: '334244809_566834498724361_8162615030692391390_n.jpg',
              photos: ['334244809_566834498724361_8162615030692391390_n.jpg'],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Lova',
                  lastName: 'RANDRIAMASINJAKA',
                },
              ],
            },
            {
              plateId: '8465 TBA',
              model: {
                brand: 'Toyota',
                modelName: 'HiAce Premio 2.8',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '281936973_312035867768640_3849435117333144459_n.jpg',
              photos: [
                '281936973_312035867768640_3849435117333144459_n.jpg',
                '337240628_117837467873113_7174119802686960073_n.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Sitraka',
                  lastName: 'RAZAFIMAHARO',
                },
              ],
            },
            {
              plateId: '9852 TAM',
              model: {
                brand: 'Toyota',
                modelName: 'HiAce Premio 2.8',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '285254794_320216706950556_5148487865375305387_n.jpg',
              photos: [
                '285254794_320216706950556_5148487865375305387_n.jpg',
                '337240628_117837467873113_7174119802686960073_n.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Marina',
                  lastName: 'RASOANAIVO',
                },
              ],
            },
            {
              plateId: '1368 TPA',
              model: {
                brand: 'Toyota',
                modelName: 'HiAce Premio 2.8',
              },
              seatsCount: {
                front: 2,
                rearCols: 4,
                rearRows: 4,
              },
              removedSeats: ['23', '33'],
              mainPhoto: '286373003_324322429873317_566160740933821040_n.jpg',
              photos: [
                '286373003_324322429873317_566160740933821040_n.jpg',
                '337240628_117837467873113_7174119802686960073_n.jpg',
              ],
              state: VehicleState.Operational,
              status: VehicleStatus.InUse,
              driversKeys: [
                {
                  firstName: 'Feno',
                  lastName: 'RAZAFIMANANTSOA',
                },
              ],
            },
          ],
        },
      ];
      const driversKeysMap = new Map<
        string,
        { firstName: string; lastName: string }[]
      >();
      const vehicles: VehicleSeederPayload[] = [];
      for (const option of vehiclesByCooperativeOptions) {
        for (const vehicle of option.vehicles) {
          const _vehicle: VehicleSeederPayload = {
            _id: new mongo.ObjectId(),
            plateId: vehicle.plateId,
            model: CarModelSeeder.getCarModelSeedDataFromMap(vehicle.model),
            seatsCount: vehicle.seatsCount,
            state: vehicle.state,
            status: vehicle.status,
            cooperative: option.cooperativeId,
          };
          if (vehicle.mainPhoto) {
            const photosSeed = generateVehiclePhotosSeed(
              vehicle.mainPhoto,
              vehicle.photos as string[],
            );
            _vehicle.mainPhotoId = photosSeed.mainPhotoId;
            _vehicle.photos = photosSeed.photos;
          }
          vehicle.removedSeats &&
            (_vehicle.removedSeats = vehicle.removedSeats);
          vehicle.tracker && (_vehicle.tracker = vehicle.tracker);
          vehicle.ongoingTrip && (_vehicle.ongoingTrip = vehicle.ongoingTrip);
          if (vehicle.driversKeys) {
            driversKeysMap.set(_vehicle._id.toString(), vehicle.driversKeys);
          }
          vehicles.push(_vehicle);
        }
      }
      VehicleSeeder.vehicles = vehicles;
      for (const vehicle of vehicles) {
        const driversKeysItems = driversKeysMap.get(vehicle._id.toString());
        vehicle.drivers = driversKeysItems.map<mongo.BSON.ObjectId>(
          (keys) => DriverSeeder.getDriverSeedFromMap(keys)._id,
        );
      }
    }
    return VehicleSeeder.vehicles;
  }

  /**
   * Getter for the vehicle map singleton
   */
  static getVehicleMap() {
    if (!VehicleSeeder.vehicleMap) {
      const vehicleMap = new Map<string, VehicleSeederPayload>();
      for (const vehicle of VehicleSeeder.getVehicles()) {
        vehicleMap.set(vehicle.plateId, vehicle);
      }
      VehicleSeeder.vehicleMap = vehicleMap;
    }
    return VehicleSeeder.vehicleMap;
  }
}
