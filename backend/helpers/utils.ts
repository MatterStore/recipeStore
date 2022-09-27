import { NextFunction, Request, Response } from 'express';
import { Model, ObjectId } from 'mongoose';

import { IUser } from '../models/user';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export interface RecordRequest<T> extends AuthenticatedRequest {
  record: T;
}

/**
 * Adds a record field to the request, or returns an error if a record matching
 * the :id parameter is not found. Request is now a RecordRequest. If matchUser
 * is true, the record will be required to match the authenticated user. This
 * will work poorly if the object lacks a `user` field.
 *
 * @param model The mongoose model to query for the record.
 * @param matchUser Whether to require the user to match the authenticated one.
 * @returns Middleware function which generates a RecordRequest.
 */
export function withRecord<T>(
  model: Model<T>,
  matchUser = false
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
    model.findById(req.params.id, (err, record) => {
      if (err) {
        res.status(422).json({ success: false, msg: 'Something went wrong.' });
      } else if (!record) {
        res.status(404).json({ success: false, msg: 'Record not found.' });
      } else if (matchUser && !cmpObjectIds(req.user._id, record.user)) {
        res.status(403).json({
          success: false,
          msg: 'Recipe belongs to another user.',
        });
      } else {
        (req as RecordRequest<T>).record = record;
        next();
      }
    });
}

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
