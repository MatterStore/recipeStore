import jwt from "jsonwebtoken";

export function validateUserJWTToken (user_token) {
  if (!user_token) return false;
  if (user_token.length <= 4) return false;
  let token = user_token.substr(4, user_token.length);
  try {
    const verified = jwt.verify(token, (process as any).send.JWT_SECRET);
    if (!verified || !verified.data) return false;
    return verified.data;
  } catch (error) {
    return false;
  }
};
