import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GeoJSONType } from '../constants/geojson.constants';

@Schema({ timestamps: false, autoCreate: false })
export class GeoJSONPoint {
  @Prop({ type: String, required: true, enum: [GeoJSONType.Point] })
  type: GeoJSONType.Point;

  @Prop({ type: [Number], required: true })
  coordinates: [number, number]; // [Longitude, Latitude]

  /**
   * @param coordinates The geographic coordinates in [Longitude, Latitude] format
   */
  constructor(coordinates: [number, number]) {
    this.type = GeoJSONType.Point;
    this.coordinates = coordinates;
  }
}

export const geoJSONPointSchema = SchemaFactory.createForClass(GeoJSONPoint);
