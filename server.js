const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Cache = require('memory-cache')
const { verifyItem } = require('./controllers/util')

app.use(express.json())
//lib config
dotenv.config()

//env setting
app.set('PORT', process.env.PORT)
app.set('DB_FRONT', process.env.DB_FRONT)
app.set('DB_ENCODER', encodeURIComponent(process.env.DB_ENCODER))
app.set('DB_BACK', process.env.DB_BACK)
app.set('HASH_PASSWORD', process.env.HASH_PASSWORD)
// console.log(app.get('HASH_PASSWORD'))
mongoose.set('strictQuery', false)
mongoose
  .connect(
    `${app.get('DB_FRONT')}${app.get('DB_ENCODER')}${app.get('DB_BACK')}`
  )
  .then(() => {
    console.log('MongoDB Connected.')
    // port Open
    app.listen(app.get('PORT'), () => {
      console.log(`listening on ${app.get('PORT')}`)
    })

    // api
    app.use('/api', require('./routes/api/version'))
    app.use('/api', require('./routes/api/content'))
    app.use('/api', require('./routes/api/channel'))
    app.use('/api', require('./routes/api/update'))
    app.use('/api', require('./routes/api/review'))
    app.use('/register', require('./routes/api/register/send'))
    app.use('/register', require('./routes/api/register/verify'))
    app.use('/register', require('./routes/api/register/emailDuplication'))
    app.use('/register', require('./routes/api/Register/nickNameDuplication'))
    app.use('/register', require('./routes/api/Register/registerSubmit'))
    app.use('/auth', require('./routes/api/auth/login'))
    app.use('/auth', require('./routes/api/auth/jwtcheck'))
  })
  .catch((err) => {
    console.log(err)
  })

setInterval(function () {
  const now = new Date()
  if (now.getHours() === 00) {
    Cache.del('deviceVerify')
    console.log(now, 'Cache deviceVerify Clear')
  }
  // if (Object.entries(verifyItem).length > 0) {
  //   Object.entries(verifyItem).map((item) => {
  //     const limitTime = item[1].limitTime
  //     if (now > limitTime) {
  //       console.log('time over')
  //       delete verifyItem[item[0]]
  //       return 0
  //     }
  //     return 0
  //   })
  //   return 0
  // }
}, 1000 * 60 * 60 * 12)
// // version API
// app.use('/api', require('./routes/api/version'))
// // storeList API
// app.use('/api', require('./routes/api/content'))

// // youtubeList API
// app.use('/api', require('./routes/api/youtubelist'))

// // youtuberList API
// app.use('/api', require('./routes/api/youtuberlist'))

// // auth
// // login API
// app.use('/auth', require('./routes/auth/login'))

// const list =
// 엑셀 리스트 db에 저장하기
// app.get('/update', (req, res) => {
//   res.send('완료')

//   list.map((store) => {
//     db.collection('contentServerData').insertOne(store)
//   })
// })
// app.get('/version', async (req, res) => {
//   console.log('gg')
//   await new Version({ version: '0.0.1' }).save()
//   res.send('dd')
// })
// app.get('/storeUpdate', (req, res) => {
//   list.map((item) => {
//     new Store(item).save()
//   })
// })
