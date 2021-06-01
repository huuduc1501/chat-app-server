const router = require('express').Router()

const { getAllMember, joinGroup, newGroup, recommendChannel, searchGroup } = require('../controllers/group')
const { protect } = require('../middlewares/auth')

router.use(protect)
router.route('/')
    .get(recommendChannel)
    .post(newGroup)
router.route('/search').get(searchGroup)

router.route('/:groupId')
    .get(getAllMember)
    .post(joinGroup)


module.exports = router