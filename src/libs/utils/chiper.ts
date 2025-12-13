import crypto from 'crypto'

const AES_KEY = process.env.AES256_CBC_KEY || '' // harus 32 byte
const AES_IV = process.env.AES256_CBC_IV || ''   // harus 16 byte

// 🔒 Enkripsi mirip XCrypt (AES-256-CBC)
export function encryptAES(data: any): string {
  const json = JSON.stringify(data)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_KEY, 'utf-8'), Buffer.from(AES_IV, 'utf-8'))
  let encrypted = cipher.update(json, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

// 🔓 Dekripsi mirip XDecrypt
export function decryptAES(encrypted: string): any {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_KEY, 'utf-8'), Buffer.from(AES_IV, 'utf-8'))
  let decrypted = decipher.update(encrypted, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}
