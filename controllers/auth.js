const { User, GroupMember, Group } = require('../configDb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const asyncHandler = require('../middlewares/asyncHandler')


exports.signup = asyncHandler(async (req, res, next) => {
    // if (!req.body) {
    //     return next({
    //         message: 'Vui lòng điền đầy đủ thông tin!',
    //         statusCode: 400,
    //     })
    // }

    const user = await User.create(req.body)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    sendToken(res, user, 200)
})

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({
        where: {
            email
        }
    })
    if (!user) {
        return next({
            message: "Không tìm thấy email!",
            statusCode: 400,
        })
    }

    const isMatchPassword = await bcrypt.compare(password, user.password)
    if (!isMatchPassword) {
        return next({
            message: 'Sai mật khẩu!',
            statusCode: 400,
        })
    }
    sendToken(res, user, 200)
})

exports.getMe = asyncHandler(async (req, res, next) => {
    let listGroups = []
    const user = await User.findByPk(req.user.id, {
        attributes: [
            'id',
            'username',
            'avatar',
            'cover',
            'email'
        ]
    })
    const joinedGroupIds = await GroupMember.findAll({
        where: {
            memberId: req.user.id
        },
        attributes: ['groupId']
    })
    if (!joinedGroupIds.length) {
        user.setDataValue('listGroups', listGroups)
        return res.status(200).json({ success: true, data: user })
    }
    joinedGroupIds.forEach(async (group, index) => {
        const groupDetail = await Group.findByPk(group.groupId, { attributes: ['id', 'name', 'description', 'createdAt',] })
        listGroups.push(groupDetail)
        if (joinedGroupIds.length - 1 === index) {
            user.setDataValue('listGroups', listGroups)
            return res.status(200).json({ success: true, data: user })
        }

    })

})

const sendToken = (res, user, statusCode) => {
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
    return res.status(statusCode).json({ success: true, data: token })
}