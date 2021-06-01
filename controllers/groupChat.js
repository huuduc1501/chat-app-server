const { User, GroupChat } = require('../configDb')

const asyncHandler = require('../middlewares/asyncHandler')

exports.getAllChat = asyncHandler(async (req, res, next) => {
    const groupChats = await GroupChat.findAll({
        include: { model: User, attributes: ['id', 'avatar', 'username'] },
        where: { groupId: req.params.groupId },
        attributes: ['id', 'createdAt', 'message'],
        order: [['createdAt']],
        limit: 20
    })
    // groupChats.forEach(groupChat => {
    //     if (groupChat.User.id === req.user.id)
    //         groupChat.setDataValue('isMine', true)
    //     else {
    //         groupChat.setDataValue('isMine', false)
    //     }
    // })
    res.status(200).json({ success: true, data: groupChats })

})

exports.newMess = asyncHandler(async (req, res, next) => {
    const newChat = await GroupChat.create(req.body)
    newChat.groupId = req.params.groupId
    newChat.senderId = req.user.id
    await newChat.save()
    const user = {
        id:req.user.id,
        avatar:req.user.avatar,
        username:req.user.username,
    }
    newChat.setDataValue('User',user)
    res.status(200).json({ success: true, data: newChat })
})
