import passport from "passport";

import { Request } from "express";
import { IUser } from "../models/user";

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export function authenticate() {
  return passport.authenticate("user", { session: false });
}
