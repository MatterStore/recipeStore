import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import * as User from '../models/user.js';

interface optsInterface {
  jwtFromRequest: unknown;
  secretOrKey: string;
}

export default function execPassport(passport) {
  const opts: optsInterface = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    'user',
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.getUserById(jwt_payload.data._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
}
