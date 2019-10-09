import { Injectable } from '@nestjs/common';

const crypto = require('crypto');
const md5 = require('js-md5');

@Injectable()
export class SonOffEncryptionService {

  public decrypt(data: string, iv: string, key: string) {
    const { binaryIv, binaryKey } = this.convertToBinary(iv, key);
    const cipher = crypto.createDecipheriv('AES-128-CBC', binaryKey, binaryIv);
    return cipher.update(data, 'base64', 'utf8') +
      cipher.final('utf8');
  }

  public encrypt(data: string, iv: string, key: string) {
    const { binaryIv, binaryKey } = this.convertToBinary(iv, key);
    const cipher = crypto.createCipheriv('AES-128-CBC', binaryKey, binaryIv);
    return cipher.update(data, 'utf8', 'base64') +
      cipher.final('base64');
  }

  private convertToBinary(iv, key): { binaryIv: any, binaryKey: any } {
    return {
      binaryIv: Buffer.from(iv, 'base64'),
      binaryKey: Buffer.from(md5.digest(key), 'base64'),
    };
  }
}
