const router = require('express').Router()

const { getAllChat, newMess } = require('../controllers/groupChat')
const { protect } = require('../middlewares/auth')

router.use(protect)

router.route('/:groupId')
    .get(getAllChat)
    .post(newMess)

module.exports = router