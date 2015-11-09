var bcrypt = require('bcrypt-nodejs');

interface IPasswordHash {
  hash: string;
  salt: string;
}

export default class PasswordUtils {

  hash(password) {
    return new Promise<IPasswordHash>((resolve, reject) => {
      if (!password) {
        reject(new Error('Password is empty'));
        return;
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
          return;
        }
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) {
            reject(err);
            return;
          }

          resolve({hash: hash, salt: salt});
        });
      });

    });
  }

  compare(hash, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  random() {
    return Math.random().toString(36).slice(-8);
  }
}
