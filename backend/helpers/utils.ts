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

/**
 * Checks whether an array contains an `ObjectId`s. Because `==` doesn't work
 * properly with `ObjectId`s, we first convert them to strings.
 *
 * @param ary Array of ObjectIDs to check for membership.
 * @param id Member to look for.
 * @returns Whether `ary` contains `id`.
 */
export function includesObjectId(
  ary: (ObjectId | string)[],
  id: ObjectId | string
): boolean {
  return ary.map(String).includes(String(id));
}
