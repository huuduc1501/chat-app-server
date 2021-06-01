const { Op } = require('sequelize/types')
const { User, Chat } = require('../configDb')

const asyncHandler = require('../middlewares/asyncHandler')

exports.newChat = asyncHandler(async (req, res, next) => {
    const { id: senderId } = req.user

    const receiverId = req.params.userId

    const chat = await Chat.create(req.body)
    chat.receiverId = receiverId
    chat.senderId = senderId
    await chat.save()
    res.status(200).json({ success: true, data: {} })
})

exports.getAll = asyncHandler(async (req, res, next) => {
    const id = req.user.id
    const chats = await Chat.findAll({
        where: {
            [Op.or]: [
                { senderId: id },
                { receiverId: id }
            ]
        },
        order: [['createdAt']],
        limit: 20
    })
    res.status(200).json({ success: true, data: chats   })
})