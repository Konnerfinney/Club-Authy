const { randomBytes } = require('crypto');

export function generateVerificationToken() {
    return randomBytes(32).toString('hex');
  }