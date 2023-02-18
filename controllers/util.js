const CryptoJS = require('crypto-js')
const axios = require('axios')
const { sens } = require('../config/config')
const Cache = require('memory-cache')

function createRandomNum() {
  return String(Math.floor(100000 + Math.random() * 900000))
}
module.exports = {
  sendVerificationSMS: async (req, res) => {
    try {
      const nationNum = '+82'
      const phoneNum = req.body.phoneNum.value
      const deviceId = req.body.deviceId
      const userPhoneNum = phoneNum
      const verificationCode = createRandomNum()
      const date = Date.now().toString()

      const sens_service_id = sens.serviceId
      const sens_access_key = sens.accessKey
      const sens_secret_key = sens.secretKey
      const sens_call_number = sens.callNumber

      const method = 'POST'
      const space = ' '
      const newLine = '\n'
      const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`
      const url2 = `/sms/v2/services/${sens_service_id}/messages`
      const hmac = CryptoJS.algo.HMAC.create(
        CryptoJS.algo.SHA256,
        sens_secret_key
      )
      hmac.update(method)
      hmac.update(space)
      hmac.update(url2)
      hmac.update(newLine)
      hmac.update(date)
      hmac.update(newLine)
      hmac.update(sens_access_key)
      const hash = hmac.finalize()
      const signature = hash.toString(CryptoJS.enc.Base64)
      Cache.put(userPhoneNum, verificationCode, 1000 * 60 * 3)
      console.log('util userPhoneNum', userPhoneNum)
      console.log('send', Cache.get(userPhoneNum))
      // const now = new Date()
      // const threeMinutesLater = moment(now).add(3, 'minutes').toDate().getTime()
      const smsRes = await axios({
        method: method,
        json: true,
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'x-ncp-iam-access-key': sens_access_key,
          'x-ncp-apigw-timestamp': date,
          'x-ncp-apigw-signature-v2': signature,
        },
        data: {
          type: 'SMS',
          countryCode: nationNum,
          from: sens_call_number,
          content: `인증번호는 [${verificationCode}] 입니다.`,
          messages: [{ to: `${userPhoneNum}` }],
        },
      })
        .then((result) => {
          return res.json({ duplication: false, limit: false })
        })
        .catch((err) => {
          console.log(err)
          return res.json({ message: 'SMS not sent catch' })
        })
    } catch (err) {
      console.log(err)
      return res.status(404).json({ message: 'SMS not sent err' })
    }
  },
  // verifyItem: verifyItem,
}
