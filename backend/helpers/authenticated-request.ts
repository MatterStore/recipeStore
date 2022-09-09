import { Request } from "express";

import { IUser } from "../models/user";

export interface AuthenticatedRequest extends Request {
  user: IUser;
}
