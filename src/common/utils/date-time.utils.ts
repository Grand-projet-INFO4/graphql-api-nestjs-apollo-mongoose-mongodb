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
