import mongoose, { ObjectId } from "mongoose";
import bcrypt from "bcryptjs";

const BCRYPT_CONST = 10;

export interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  name: string;
  emailVerified: boolean;
  admin: boolean;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: false,
  },
  admin: {
    type: Boolean,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

export function getUserById(id, callback) {
  User.findById({ _id: id }, callback);
}

export function authenticateUser(email, callback) {
  User.updateOne({ email: email }, { $set: { authenticated: true } }, callback);
}

export function getUserByEmail(email, callback) {
  const query = { email: email };
  User.findOne(query, callback);
}

export function addUser(newUser, callback) {
  bcrypt.genSalt(BCRYPT_CONST, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

export function comparePassword(candidatePassword, hash, callback) {
  if (candidatePassword) {
    bcrypt.compare(candidatePassword, hash, callback);
  } else {
    callback("Invalid password", false);
  }
}

export function updatePassword(
  userId: ObjectId,
  newPassword: string,
  callback: (err: any, ok: boolean) => void
) {
  bcrypt.genSalt(BCRYPT_CONST, (err, salt) => {
    if (err) {
      callback(err, false);
    } else {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) {
          callback(err, false);
        } else {
          User.updateOne(
            { _id: userId },
            { $set: { password: hash } },
            callback
          );
        }
      });
    }
  });
}
