import { Seeder } from 'nestjs-seeder';
import { Connection, mongo } from 'mongoose';

import {
  CooperativePhoto,
  CooperativePhotoModel,
  PHOTO_COLLECTION,
  Photo,
  PhotoModel,
} from './schema';
import { ReplaceFields } from 'src/common/types/utils';
import { WithMongoId } from 'src/common/types/mongo-id';
import { CooperativeSeeder } from '../cooperative/cooperative.seeder';
import { ParkingLotSeeder } from '../parking-lot/parking-lot.seeder';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { modelCollectionExists } from 'src/common/helpers/mongo.helper';

type CooperativePhotosSeedOptions = WithMongoId<{
  photos: string[];
  cooperativeId: mongo.BSON.ObjectId;
  parkingLots: ParkingLotPhotosSeedOptions[];
}>;

type ParkingLotPhotosSeedOptions = {
  address: string;
  mainPhoto: string;
  photos: WithMongoId<{ filename: string }>[];
};

export type CooperativePhotoSeederPayload = WithMongoId<
  ReplaceFields<
    CooperativePhoto,
    {
      filename: string;
      parkingLotId?: mongo.BSON.ObjectId;
      cooperativeId: mongo.BSON.ObjectId;
    }
  >
>;

export class PhotoSeeder implements Seeder {
  // Photos seed data singleton
  private static photos: CooperativePhotoSeederPayload[] | null = null;

  // The photos seed data options singleton
  private static photosOptions: CooperativePhotosSeedOptions[] | null = null;

  // Map of cooperative id - parking lot address combination key and parking lot's main photo id value singleton
  private static parkingLotMainPhotoMap: Map<
    string,
    mongo.BSON.ObjectId
  > | null = null;

  constructor(
    @InjectModel(Photo.name) private photoModel: PhotoModel,
    @InjectModel(CooperativePhoto.name)
    private cooperativephotoModel: CooperativePhotoModel,
    @InjectConnection() private connection: Connection,
  ) {}

  async seed() {
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.cooperativephotoModel.insertMany(PhotoSeeder.getPhotos());
    await session.commitTransaction();
    console.log(`Seeded the \`${PHOTO_COLLECTION}\` collection ...`);
  }

  async drop() {
    if (!(await modelCollectionExists(this.photoModel))) return;
    const session = await this.connection.startSession();
    session.startTransaction();
    await this.connection.dropCollection(PHOTO_COLLECTION);
    await session.commitTransaction();
    console.log(`Cleared the \`${PHOTO_COLLECTION}\` collection ...`);
  }

  /**
   * Getter for the photos seed data options singleton
   */
  static getPhotosOptions() {
    if (!PhotoSeeder.photosOptions) {
      const cooperativeSlugMap = CooperativeSeeder.getCooperativesSlugMap();
      const photosOptions: CooperativePhotosSeedOptions[] = [
        {
          _id: new mongo.ObjectId(),
          cooperativeId: cooperativeSlugMap.get('trans-vatsi')._id,
          photos: ['1690835281309.jpg', '1690835291188.jpg'],
          parkingLots: [
            {
              address:
                'Rue Dr Raboto Raphael, Manjakaray, Antananarivo, Madagascar',
              mainPhoto: 'vatsi-7.PNG',
              photos: [
                { _id: new mongo.ObjectId(), filename: 'vatsi-7.PNG' },
                { _id: new mongo.ObjectId(), filename: 'vatsi-1.PNG' },
              ],
            },
            {
              address: "Boulevard d'Andovoranto, Toamasina, Madagascar",
              mainPhoto: '2017-09-30(2).jpg',
              photos: [
                { _id: new mongo.ObjectId(), filename: '2017-09-30(2).jpg' },
              ],
            },
          ],
        },
        {
          _id: new mongo.ObjectId(),
          cooperativeId: cooperativeSlugMap.get('kofmad')._id,
          photos: [
            '311270635_100993252802699_4131159110360871436_n.jpg',
            '311297869_102121522689872_3376781338344466182_n.jpg',
          ],
          parkingLots: [],
        },
        {
          _id: new mongo.ObjectId(),
          cooperativeId: cooperativeSlugMap.get('kofimanga-plus')._id,
          photos: [
            '363953356_701751605300099_6769422731043737871_n.png',
            '364078247_704731325002127_1469601796754663328_n.jpg',
            '365976046_706731624802097_5887049135998859623_n.jpg',
            '576869_254373777997824_1455296371_n.jpg',
            '130737440_942392079620297_3079641263248482074_n.jpg',
          ],
          parkingLots: [
            {
              address: 'Gare routière Maki, Antananarivo, Madagascar',
              mainPhoto: '278482817_117944960872566_4160933825694072493_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '278482817_117944960872566_4160933825694072493_n.jpg',
                },
              ],
            },
            {
              address:
                'Rue Dr Raboto Raphael, Manjakaray, Antananarivo, Madagascar',
              mainPhoto: '309450184_168411742502824_1838453792539744655_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '309450184_168411742502824_1838453792539744655_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '130731648_942392099620295_5655143343480527198_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '164003266_3286069634828208_1829023587898639135_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '163639006_3286069824828189_7232932689536343638_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '130867740_942392096286962_5784091243227717278_n.jpg',
                },
              ],
            },
            {
              address: 'Gare routière Moramanga, Moramanga, Madagascar',
              mainPhoto: '8682817724_e1f94b9612_b.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename: '8682817724_e1f94b9612_b.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '332122951_567666478636135_1087063755523566444_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '331324926_730129665510597_2246293598378208237_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '331372727_1372651633566910_2085795307513612153_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '331481823_4528458157278398_2651394600394146643_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '331683382_540074964636344_1072572942038300305_n.jpg',
                },
              ],
            },
            {
              address: 'Gare routière Tanamabo V, Toamasina, Madagascar',
              mainPhoto: '304974125_493230926145306_2514353595062766745_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '304974125_493230926145306_2514353595062766745_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '32796154_1331420606959797_2278223058080628736_n.jpg',
                },
              ],
            },
            {
              address: 'Gare routière, Fenoarivo Atsinanana, Madagascar',
              mainPhoto: '522356_297079880393880_1604130682_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename: '522356_297079880393880_1604130682_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '10445521_511348592300340_1724228002743980558_n.jpg',
                },
              ],
            },
          ],
        },
        {
          _id: new mongo.ObjectId(),
          cooperativeId: cooperativeSlugMap.get('transam_plus')._id,
          photos: [
            '1690834389862.jpg',
            '1690834360323.jpg',
            '1690834345083.jpg',
            '273856176_147951777666811_253705893243512684_n.jpg',
            '348825182_632732918404190_6727275300545458163_n.jpg',
            '348610907_532983625509137_1613671846958208864_n.jpg',
          ],
          parkingLots: [
            {
              address: 'Ankadindramamy, Antananarivo, Madagascar',
              mainPhoto: '274474168_150673537394635_1834526597234907119_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '274474168_150673537394635_1834526597234907119_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '264371762_131531575975498_4121150763048267774_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '227367162_131531969308792_3044352901081282694_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '264469747_131531999308789_8377845880883151173_n.jpg',
                },
              ],
            },
            {
              address: 'Gare routière Tanambao V, Toamasina, Madagascar',
              mainPhoto: '272805814_144117598050229_8131936109285056052_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '272805814_144117598050229_8131936109285056052_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '264367832_131532029308786_3075093258875356083_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '264232894_131532179308771_8574478735969746097_n.jpg',
                },
              ],
            },
          ],
        },
        {
          _id: new mongo.ObjectId(),
          cooperativeId: cooperativeSlugMap.get('soatrans_plus')._id,
          photos: [
            '242702611_161108916194670_8053392101540059777_n.jpg',
            '360109727_258052356967130_872077573164824967_n.jpg',
            '203116759_117048377267391_4930110854443736273_n.jpg',
            '269732558_218353780470183_6227586691776024970_n.jpg',
            '361890672_261769283262104_3210778242656671450_n.jpg',
            '282062947_312035887768638_6475937910912857135_n.jpg',
            '1690834911765.jpg',
            '1690834879520.jpg',
          ],
          parkingLots: [
            {
              address:
                "Station Galàna Andrefan'Ambohijanahary, Antananarivo, Madagascar",
              mainPhoto: '241566304_148061537499408_8230699236591506144_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '192423811_105290678443161_9204749916629933969_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '241566304_148061537499408_8230699236591506144_n.jpg',
                },
              ],
            },
            {
              address: 'Avenue Maréchal Foch, Antsirabe, Madagascar',
              mainPhoto: '358039422_251167807655585_8869925291891398285_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '358039422_251167807655585_8869925291891398285_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '307211172_1307703383300511_5629251824771100304_n.jpg',
                },
              ],
            },
            {
              address:
                'Enceinte Pietra (Ex Sofia), Ambalakisoa, Fianarantsoa, Madagascar',
              mainPhoto: '1690834922698.jpg',
              photos: [
                { _id: new mongo.ObjectId(), filename: '1690834922698.jpg' },
                { _id: new mongo.ObjectId(), filename: '1690834927156.jpg' },
                {
                  _id: new mongo.ObjectId(),
                  filename: 'soatrans-plus-fianara.PNG',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '313310291_144233491682351_7931892772421720792_n.jpg',
                },
              ],
            },
            {
              address:
                'Enceinte Pietra (Ex Sofia), Ambalakisoa, Fianarantsoa, Madagascar',
              mainPhoto: '1690834922698.jpg',
              photos: [
                { _id: new mongo.ObjectId(), filename: '1690834922698.jpg' },
                { _id: new mongo.ObjectId(), filename: '1690834927156.jpg' },
                {
                  _id: new mongo.ObjectId(),
                  filename: 'soatrans-plus-fianara.PNG',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '313310291_144233491682351_7931892772421720792_n.jpg',
                },
              ],
            },
            {
              address:
                'Annexe Hôtel La Vanille, Ankofafa, Manakara, Madagascar',
              mainPhoto: '336705954_546328600716025_9088694608477315439_n.jpg',
              photos: [
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '336705954_546328600716025_9088694608477315439_n.jpg',
                },
                {
                  _id: new mongo.ObjectId(),
                  filename:
                    '337996799_764156628435336_3878080849282238542_n.jpg',
                },
              ],
            },
          ],
        },
      ];
      PhotoSeeder.photosOptions = photosOptions;
    }
    return PhotoSeeder.photosOptions;
  }

  /**
   * Getter for the photos seed data singleton
   */
  static getPhotos() {
    if (!PhotoSeeder.photos) {
      const coopParkingLotPhotoAddressMapMap = new Map<
        string,
        Map<string, string>
      >();
      const photos: CooperativePhotoSeederPayload[] = [];
      const photosOptions = PhotoSeeder.getPhotosOptions();
      for (const coopPhotosOptions of photosOptions) {
        for (const photo of coopPhotosOptions.photos) {
          photos.push({
            _id: new mongo.ObjectId(),
            filename: photo,
            cooperativeId: coopPhotosOptions.cooperativeId,
          });
        }
        const coopParkingLotPhotoAddressMapMapKey =
          coopPhotosOptions.cooperativeId.toString();
        const parkingLotPhotoAddressMap =
          coopParkingLotPhotoAddressMapMap.get(
            coopParkingLotPhotoAddressMapMapKey,
          ) ?? new Map<string, string>();
        if (
          !coopParkingLotPhotoAddressMapMap.has(
            coopParkingLotPhotoAddressMapMapKey,
          )
        ) {
          coopParkingLotPhotoAddressMapMap.set(
            coopParkingLotPhotoAddressMapMapKey,
            parkingLotPhotoAddressMap,
          );
        }
        for (const parkingLotPhotosOptions of coopPhotosOptions.parkingLots) {
          for (const photo of parkingLotPhotosOptions.photos) {
            const plPhoto: CooperativePhotoSeederPayload = {
              _id: photo._id,
              filename: photo.filename,
              cooperativeId: coopPhotosOptions.cooperativeId,
            };
            photos.push(plPhoto);
            const parkingLotPhotoAddressMapKey = plPhoto._id.toString();
            parkingLotPhotoAddressMap.set(
              parkingLotPhotoAddressMapKey,
              parkingLotPhotosOptions.address,
            );
          }
        }
      }
      PhotoSeeder.photos = photos;
      let prevCooperativeId: string,
        prevParkingLotPhotoAddressMap: Map<string, string>;
      for (const photo of photos) {
        const cooperativeId = photo.cooperativeId.toString();
        const parkingLotPhotoAddressMap =
          !prevCooperativeId || cooperativeId !== prevCooperativeId
            ? coopParkingLotPhotoAddressMapMap.get(cooperativeId)
            : prevParkingLotPhotoAddressMap;
        const address = parkingLotPhotoAddressMap.get(photo._id.toString());
        if (address) {
          const parkingLotId = ParkingLotSeeder.getParkingLotSeedFromMap({
            address,
            cooperativeId: photo.cooperativeId,
          })._id;
          photo.parkingLotId = parkingLotId;
        }
        prevCooperativeId = cooperativeId;
        prevParkingLotPhotoAddressMap = parkingLotPhotoAddressMap;
      }
    }
    return PhotoSeeder.photos;
  }

  /**
   * Getter for the parking lot main photo map singleton
   */
  static getParkingLotMainPhotoMap() {
    if (!PhotoSeeder.parkingLotMainPhotoMap) {
      const parkingLotMainPhotoMap = new Map<string, mongo.BSON.ObjectId>();
      const photosOptions = PhotoSeeder.getPhotosOptions();
      for (const cooperativePhotosOptions of photosOptions) {
        for (const parkingLotPhotosOptions of cooperativePhotosOptions.parkingLots) {
          const key = ParkingLotSeeder.generateParkingLotMapKey({
            address: parkingLotPhotosOptions.address,
            cooperativeId: cooperativePhotosOptions.cooperativeId,
          });
          const mainPhoto = parkingLotPhotosOptions.photos.find(
            (photo) => photo.filename === parkingLotPhotosOptions.mainPhoto,
          ) as WithMongoId<{ filename: string }>;
          parkingLotMainPhotoMap.set(key, mainPhoto._id);
        }
      }
      PhotoSeeder.parkingLotMainPhotoMap = parkingLotMainPhotoMap;
    }
    return PhotoSeeder.parkingLotMainPhotoMap;
  }
}
