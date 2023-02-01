import {
  createHash,
  createCipher,
  createDecipher,
} from 'crypto'

export const encryptHash = (algorithm: string, content: string) => {
  let hash = createHash(algorithm)
  hash.update(content)
  return hash.digest('hex')
}

function aesEncrypt(data: string, key: string) {
  const cipher = createCipher('aes192', key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function aesDecrypt(encrypted:string, key: string) {
  const decipher = createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const aes = {
  encrypt: aesEncrypt,
  decrypt: aesDecrypt
}
export * as crypto from 'crypto'
export const sha1 = (content: string) => encryptHash('sha1', content)
export const md5 = (content: string) => encryptHash('md5', content)

