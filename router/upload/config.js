const COS = require('cos-nodejs-sdk-v5')
const dotenv = require('dotenv')
dotenv.config()
const { SECRET_ID, SECRET_KEY } = process.env

dotenv.config()
const cos = new COS({
  SecretId: SECRET_ID,
  SecretKey: SECRET_KEY
})

module.exports = cos
