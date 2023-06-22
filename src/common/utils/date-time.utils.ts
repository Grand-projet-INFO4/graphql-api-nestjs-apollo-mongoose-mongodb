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
 * Parses a days duration in `<x>d` format and returns its milliseconds value
 *
 * @param stringDuration The duration in `<x>d` string format
 * @return The milliseconds value
 */
export function parseDuration(stringDuration: string): number {
  if (!stringDuration.match(/^\d+[d]$/)) {
    throw new Error('The duration format is invalid');
  }
  const count = parseInt(stringDuration.replace(/\D/, ''));
  return count * 24 * 60 * 60 * 1000;
}

/**
 * Returns the date added from the current date and a given date
 *
 * @param duration The duration to add in milliseconds
 * @returns The projected date
 */
export function addDurationFromNow(stringDuration: string): Date {
  return new Date(Date.now() + parseDuration(stringDuration));
}
