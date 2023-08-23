/**
 * Gets the starting time and the ending time of a date i.e {date}T00:00:00 and {date}T23:59:59
 * @param date A given date in a date compliant format
 * @return The given date's starting and ending times respectively in a ISO date format
 */
export function getDateEdgeTimes(date: string): [string, string] {
  const dateTimes: [string, string] = ['', ''];
  const d = new Date(date);
  // Starting time
  d.setHours(0, 0, 0);
  dateTimes[0] = d.toISOString();
  // Ending time
  d.setHours(23, 59, 59);
  dateTimes[1] = d.toISOString();
  return dateTimes;
}

/**
 * Returns the date added from the current date and a given duration
 *
 * @param duration The duration to add in seconds
 * @returns The projected date
 */
export function addDurationFromNow(duration: number): Date {
  return new Date(Date.now() + duration * 1000);
}

// Regular expression for a time only string in a hh:mm format
export const timeRegexp = /^\d{2}:\d{2}$/;

/**
 * Checks if a string value complies to a valid time only format (hh:mm)
 *
 * @param value The string value
 */
export function isTimeOnlyFormat(value: string) {
  return timeRegexp.test(value);
}

/**
 * Substracts the current date some given amount of time
 *
 * @param amount The amount of time to substract
 * @param unit The unit of the substracted amount of time
 * @return The substracted date
 */
export function substractNowDate(amount: number, unit: 'month' | 'hour'): Date {
  // Milliseconds multiplier
  let msMultiplier: number;
  switch (unit) {
    case 'hour':
      msMultiplier = 60 * 60 * 1000;
      break;
    case 'month':
      msMultiplier = 30 * 24 * 60 * 60 * 1000;
      break;

    default:
      msMultiplier = 1;
      break;
  }
  return new Date(Date.now() - amount * msMultiplier);
}

/**
 * Checks if 2 dates are in the same date
 */
export function haveSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
