import { frontSeatRegExp, rearSeatRegExp } from '../vehicle.constants';

/**
 * Checks if a seat value as a string complies to a valid vehicle seat pattern
 *
 * @param value The seat value as a string
 */
export function isValidSeat(value: string): boolean {
  return frontSeatRegExp.test(value) || rearSeatRegExp.test(value);
}
