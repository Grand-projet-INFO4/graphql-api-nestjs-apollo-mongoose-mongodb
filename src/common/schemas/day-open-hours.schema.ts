import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// The shorts for the days of a week to store into the database
export enum WeekDayShort {
  Monday = 'Mon',
  Tuesday = 'Tue',
  Wednesday = 'Wed',
  Thursday = 'Thu',
  Friday = 'Fri',
  Saturday = 'Sat',
  Sunday = 'Sun',
}
export const weekDayShorts = [
  WeekDayShort.Monday,
  WeekDayShort.Tuesday,
  WeekDayShort.Wednesday,
  WeekDayShort.Thursday,
  WeekDayShort.Friday,
  WeekDayShort.Saturday,
  WeekDayShort.Sunday,
];

@Schema({ autoCreate: false, timestamps: true })
export class DayOpenHours {
  @Prop({ type: String, required: true })
  opensAt: string;

  @Prop({ type: String, required: true })
  closesAt: string;

  @Prop({ type: String, required: true, enum: weekDayShorts })
  day: WeekDayShort;
}

export const dayOpenHoursSchema = SchemaFactory.createForClass(DayOpenHours);
