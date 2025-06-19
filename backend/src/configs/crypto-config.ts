import 'dotenv/config'

import CryptoJS from 'crypto-js'

export default {
  key: process.env.ENCRYPT_KEY || '',
  options: {
    iv: CryptoJS.lib.WordArray.random(16),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  },
}
