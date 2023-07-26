import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';

import { Region, regionSchema } from 'src/api/region/schema';
import { RegionSeeder } from 'src/api/region/region.seeder';
import { City, citySchema } from 'src/api/city/schema';
import { CitySeeder } from 'src/api/city/city.seeder';
import { UserSeeder } from 'src/api/user/user.seeder';
import { User, userSchema } from 'src/api/user/schema';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL as string),
    MongooseModule.forFeature([{ name: Region.name, schema: regionSchema }]),
    MongooseModule.forFeature([{ name: City.name, schema: citySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
}).run([UserSeeder, RegionSeeder, CitySeeder]);
