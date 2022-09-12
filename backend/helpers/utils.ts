import { ObjectId } from "mongoose";

/**
 * Compares two `ObjectId`s for equality. Because they are objects they do not
 * compare properly with the `==` operator, so first convert to strings.
 *
 * @param a First object ID.
 * @param b Second object ID.
 * @returns Whether IDs are equal
 */
export function cmpObjectIds(
  a: ObjectId | string,
  b: ObjectId | string
): boolean {
  return String(a) == String(b);
}
