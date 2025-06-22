import 'dotenv/config'

const configs = {
  serverPort: process.env.SERVER_PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default',
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  jwtRefreshExpiration: process.env.JWT_EXPIRATION || '15d',
}

export default configs
