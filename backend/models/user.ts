import mongoose, { ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';

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
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    required: false
  },
  admin: {
    type: Boolean,
    required: false
  }
});

const User = mongoose.model('User', userSchema);

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
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

export function comparePassword(candidatePassword, hash, callback) {
  if (!candidatePassword) {
    return false;
  }
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

export function updatePassword(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(newUser.newPassword, salt, (err, hash) => {
      if (err) throw err;
      newUser.newPassword = hash;
      User.updateOne(
        { email: newUser.email },
        { $set: { password: newUser.newPassword } },
        callback
      );
    });
  });
}
