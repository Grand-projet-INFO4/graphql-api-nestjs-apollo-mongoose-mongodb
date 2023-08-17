import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  DayOpenHours,
  WeekDayShort,
  dayOpenHoursSchema,
  weekDayShorts,
} from './day-open-hours.schema';
import { isTimeOnlyFormat } from '../utils/date-time.utils';

@Schema({ autoCreate: false, timestamps: false })
export class WeekOpenHours {
  // Weekly open hours as a raw array of daily open hours of all the week's days
  // If defined, then the rest of the attributes are not taken into account except for the timezone offset
  @Prop({ type: [{ type: dayOpenHoursSchema, required: true }] })
  bulk?: DayOpenHours[];

  // The opening hour (hh:mm)
  @Prop({
    type: String,
    validate(value) {
      return isTimeOnlyFormat(value);
    },
  })
  opensAt?: string;

  // The closing hour (hh:mm)
  @Prop({
    type: String,
    validate(value) {
      return isTimeOnlyFormat(value);
    },
  })
  closesAt?: string;

  // Daily open hours for some exception of days that differs from the previously defined opening and closing
  @Prop({ type: [{ type: dayOpenHoursSchema, required: true }] })
  except?: DayOpenHours[];

  // The open days
  // If not defined, either all a week's days are open or all week's days without any specified days off
  @Prop({ type: [{ type: String, required: true, enum: weekDayShorts }] })
  daysOn?: WeekDayShort[];

  // The days off
  // If not defined, either all a week's days are open or only any specified open days
  @Prop({ type: [{ type: String, required: true, enum: weekDayShorts }] })
  daysOff?: WeekDayShort[];

  // The TimeZone offset from which the parking lot's time is defined
  // Crucial when we want to perform date queries using the open hours' times
  @Prop({ type: Number, required: true, default: 3 })
  tzOffset: number;
}

export const weekOpenHoursSchema = SchemaFactory.createForClass(WeekOpenHours);
