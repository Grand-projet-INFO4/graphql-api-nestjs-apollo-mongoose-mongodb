/**
 * Generates a strictly positive number from a given numbers range
 *
 * @param to The maximum value
 * @param from The minimum value (Defaults to 1)
 */
export function getRandomInteger(to: number, from = 1) {
  if (from && from >= to) {
    throw new Error(
      'The `from` argument must be smaller that the `to` arguement',
    );
  }
  return Math.floor(Math.random() * to) + from;
}
