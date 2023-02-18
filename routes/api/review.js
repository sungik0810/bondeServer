const express = require('express')
const router = express.Router()
const User = require('../../models/UserModel')
const ReviewItem = require('../../models/ReviewItemModel')
const multer = require('multer')
const { s3 } = require('../../aws')
const multerS3 = require('multer-s3')
const logger = require('../../controllers/logger')
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, './uploads/review'),
//   filename: (req, file, cb) =>
//     cb(
//       null,
//       `${req.headers.datanumber}_review_${req.headers.username}_${req.headers.uuid}.jpeg`
//     ),
// })

const storage = multerS3({
  s3,
  bucket: 'bonde-image-server',
  key: (req, file, cb) =>
    cb(
      null,
      `review/raw/${req.headers.datanumber}_review_${req.headers.username}_${req.headers.uuid}.jpeg`
    ),
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) cb(null, true)
    else cb(new Error('invalid file type.'), false)
  },
  // dest: 'uploads/review'
})

router.post(
  '/review/photo',
  upload.single('reviewImage'),
  async (req, res, next) => {
    if (req.fileValidationError) {
      console.log(req.fileValidationError)
      return res.json({ message: 'error' })
    }
    const KST_OFFSET = 9 * 60 * 60 * 1000
    const kstNow = new Date(Date.now() + KST_OFFSET)
    const year = kstNow.getUTCFullYear().toString()
    const month = (kstNow.getUTCMonth() + 1).toString().padStart(2, '0')
    const date = kstNow.getUTCDate().toString().padStart(2, '0')
    const hour = kstNow.getUTCHours().toString().padStart(2, '0')
    const minute = kstNow.getUTCMinutes().toString().padStart(2, '0')
    const postDate = `${year}-${month}-${date}`
    const postTime = `${hour}:${minute}`
    //userData
    const dataNumber = req.headers.datanumber
    const userEmail = req.headers.useremail
    const userName = req.headers.username
    const userNickName = req.headers.usernickname
    const reviewText = req.headers.reviewdata
    const reviewImage = req.file.key
    const uuid = req.headers.uuid
    const userIpAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const logText = `POST | review/photo | ${postDate} ${postTime} / userIp:${userIpAddress} dataNumber:${dataNumber} userEmail:${userEmail} uuid:${uuid}`
    logger.info(logText)
    // multer

    const reviewUpdate = new ReviewItem({
      dataNumber: dataNumber,
      userEmail: userEmail,
      userName: userName,
      userNickName: userNickName,
      reviewUuid: uuid,
      reviewText: reviewText,
      reviewImage: reviewImage,
      postDate: postDate,
      postTime: postTime,
    }).save()
    console.log(reviewUpdate)
    console.log('create new Review doc with Photo')
    return res.json({ message: 'create new Review doc with Photo' })
  }
)

router.post('/review/text', async (req, res) => {
  const KST_OFFSET = 9 * 60 * 60 * 1000 // KST와 UTC의 차이 (밀리초 단위)
  const kstNow = new Date(Date.now() + KST_OFFSET)
  const year = kstNow.getUTCFullYear().toString()
  const month = (kstNow.getUTCMonth() + 1).toString().padStart(2, '0')
  const date = kstNow.getUTCDate().toString().padStart(2, '0')
  const hour = kstNow.getUTCHours().toString().padStart(2, '0')
  const minute = kstNow.getUTCMinutes().toString().padStart(2, '0')
  const postDate = `${year}-${month}-${date}` // 예시 결과: 20230216
  const postTime = `${hour}:${minute}`
  //userData
  const dataNumber = req.body.datanumber
  const userEmail = req.body.useremail
  const userName = req.body.username
  const userNickName = req.body.usernickname
  const reviewText = req.body.reviewdata
  const reviewImage = 'emptyReviewImage.jpeg'
  const uuid = req.body.uuid
  const userIpAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const logText = `POST | review/text | ${postDate} ${postTime} / userIp:${userIpAddress} dataNumber:${dataNumber} userEmail:${userEmail} uuid:${uuid}`
  logger.info(logText)
  // multer

  async function updateReview(
    uuid,
    dataNumber,
    reviewText,
    reviewImage,
    postDate,
    postTime,
    userEmail,
    userName,
    userNickName
  ) {
    try {
      const reviewUpdate = new ReviewItem({
        dataNumber: dataNumber,
        userEmail: userEmail,
        userName: userName,
        userNickName: userNickName,
        reviewUuid: uuid,
        reviewText: reviewText,
        reviewImage: reviewImage,
        postDate: postDate,
        postTime: postTime,
      }).save()
      console.log('create new Review doc')
    } catch (err) {
      console.log(err)
    }
  }
  await updateReview(
    uuid,
    dataNumber,
    reviewText,
    reviewImage,
    postDate,
    postTime,
    userEmail,
    userName,
    userNickName
  )
  return res.json({ message: 'create new Review doc' })
})

router.get('/review', (req, res) => {
  const KST_OFFSET = 9 * 60 * 60 * 1000 // KST와 UTC의 차이 (밀리초 단위)
  const kstNow = new Date(Date.now() + KST_OFFSET)
  const year = kstNow.getUTCFullYear().toString()
  const month = (kstNow.getUTCMonth() + 1).toString().padStart(2, '0')
  const date = kstNow.getUTCDate().toString().padStart(2, '0')
  const hour = kstNow.getUTCHours().toString().padStart(2, '0')
  const minute = kstNow.getUTCMinutes().toString().padStart(2, '0')
  const postDate = `${year}-${month}-${date}` // 예시 결과: 20230216
  const postTime = `${hour}:${minute}`
  const userIpAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const dataNumber = req.query.dataNumber
  const logText = `GET | review | ${postDate} ${postTime} / userIp:${userIpAddress} dataNumber:${dataNumber}`
  logger.info(logText)
  async function findReview(dataNumber) {
    try {
      const review = await ReviewItem.find({ dataNumber: dataNumber }).sort({
        createdAt: -1,
      })

      return res.json({ reviewItems: review })
    } catch (err) {
      console.log(err)
      return
    }
  }
  findReview(dataNumber)
})

module.exports = router

// async function updateStore(dataNumber) {
//   try {
//     const store = await Store.findOne({ dataNumber: dataNumber })
//     if (!store) {
//       console.log('Data not found')
//       return
//     }

//     store.review = [newPostReviewData, ...store.review]
//     await store.save()
//   } catch (err) {
//     console.log(err)
//   }
// }
