const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../../../config/config')

router.post('/jwtcheck', async (req, res) => {
  const now = new Date().getTime().toString().slice(0, 10)
  const JWT_PRIVATE_KEY = jwtConfig.JWT_PRIVATE_KEY
  const userEmail = req.body.email
  const accessToken = req.body.jwt
  // const accessToken =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoic3VuZ2lrMDgxMEBuYXZlci5jb20iLCJuYW1lIjoiY2hvc3VuZ2lrIiwibmlja05hbWUiOiJzdW5naWswODEwIn0sImlhdCI6MTY3NjQzNDkxOCwiZXhwIjoxNjc2NDM0OTc4fQ.98X1ylgoiySMJiDFxnwssDoDbmFvuoLsN_34KdHED-A'
  // const UserData = await User.find({ email: userEmail })
  // const refreshToken = UserData[0].refreshToken

  // const refreshTokenVerify = jwt.verify(
  //   refreshToken,
  //   JWT_PRIVATE_KEY,
  //   (err, decoded) => {
  //     if (err) return false
  //     if (decoded) return true
  //   }
  // )

  const AccessTokenVerify = jwt.verify(
    accessToken,
    JWT_PRIVATE_KEY,
    async (err, decoded) => {
      if (err) {
        // 1. 시간이 만료 됐을 경우
        if (err.message === 'jwt expired') {
          console.log('jwt expired!')
          const UserData = await User.find({ email: userEmail })
          const refreshToken = UserData[0].refreshToken
          const refreshTokenVerify = jwt.verify(
            refreshToken,
            JWT_PRIVATE_KEY,
            (err, decoded) => {
              if (err) {
                console.log('err! jwt reAccessToken not make err!')
                res.json({ signature: false })
              }
              if (decoded) {
                const newAccessToken = jwt.sign(
                  {
                    data: {
                      email: decoded.data.email,
                      name: decoded.data.name,
                      nickName: decoded.data.nickName,
                    },
                  },
                  JWT_PRIVATE_KEY,
                  {
                    expiresIn: '1d',
                  }
                )
                console.log('jwt reAccessToken make!')
                return res.json({
                  signature: true,
                  sendAccessToken: newAccessToken,
                  message: 'newAccessToken',
                })
              }
            }
          )
        } else {
          console.log('invalid token error!')
          return res.json({ signature: false })
        }
        console.log(err.message)
      }
      if (decoded) {
        return res.json({
          signature: true,
          sendAccessToken: accessToken,
          message: 'oldAccessToken',
        })
      }
    }
  )

  // const verify = jwt.verify(
  //   accessToken,
  //   JWT_PRIVATE_KEY,
  //   function (err, decoded) {
  //     console.log('err', err.expiredAt)
  //     console.log('decoded', decoded)
  //     if (err) {
  //       console.log(err.message)
  //       console.log('accessToken err')
  //       return res.json({ state: false })
  //     }
  //     // console.log(decoded) // bar
  //     if (parseInt(now) >= decoded.exp) {
  //       if (refreshTokenVerify) {
  // const newAccessToken = jwt.sign(
  //   {
  //     data: {
  //       email: decoded.data.email,
  //       name: decoded.data.name,
  //       nickName: decoded.data.nickName,
  //     },
  //   },
  //   JWT_PRIVATE_KEY,
  //   {
  //     expiresIn: '1m',
  //   }
  // )
  //         console.log('new AccessToken create')
  //         return res.json({
  //           state: false,
  //           newToken: newAccessToken,
  //           message: 'exp over',
  //         })
  //       } else {
  //         console.log('refreshToken err')
  //         return res.json({ state: false })
  //       }
  //     }
  //     console.log('accessToken exp exist')
  //     return res.json({ state: true })
  //   }
  // )
  // console.log('verify', verify)

  //   const user = await User.find({ email: userEmail })
  //   if (user.length >= 1) {
  //     const userPassword = await comparePassword(
  //       req.body.userData.password,
  //       user[0].password
  //     )
  //     if (userPassword) {
  //       //login
  //       //jwt 생성
  //       console.log(user)
  //       const refreshToken = user[0].refreshToken
  //       // const token = jwt.sign({ data: userEmail }, JWT_PRIVATE_KEY, {
  //       //   expiresIn: '1h',
  //       // })
  //       const verify = jwt.verify(
  //         refreshToken,
  //         JWT_PRIVATE_KEY,
  //         function (err, decoded) {
  //           if (err) return console.log(err)
  //           console.log(decoded) // bar
  //           const accessToken = jwt.sign(
  //             {
  //               data: {
  //                 email: userEmail,
  //                 name: user[0].name,
  //                 nickName: user[0].nickName,
  //               },
  //             },
  //             JWT_PRIVATE_KEY,
  //             {
  //               expiresIn: '7d',
  //             }
  //           )
  //           return res.json({ state: true, token: accessToken })
  //         }
  //       )
  //     } else if (!userPassword) {
  //       //password wrong
  //       return res.json({ state: false, num: 1 })
  //     }
  //   } else if (user.length < 1) {
  //     // not found
  //     return res.json({ state: false, num: 0 })
  //   }
})

module.exports = router
