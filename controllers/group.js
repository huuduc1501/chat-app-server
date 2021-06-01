const { Op } = require('sequelize')

const { Group, GroupMember, User } = require('../configDb')
const asyncHandler = require('../middlewares/asyncHandler')

exports.newGroup = asyncHandler(async (req, res, next) => {

    const group = await Group.create(req.body)
    group.ownerId = req.user.id
    await group.save()

    await GroupMember.create({
        groupId: group.id,
        memberId: req.user.id
    })
    res.status(200).json({ success: true, data: group })
})

exports.joinGroup = asyncHandler(async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId)
    // console.log(group)
    const exist = await GroupMember.findOne({ where: { memberId: req.user.id, groupId: group.id } })
    if (exist)
        return res.status(200).json({ success: true, data: {} })
    await GroupMember.create({
        groupId: group.id,
        memberId: req.user.id
    })
    res.status(200).json({ success: true, data: {} })
})

exports.recommendChannel = asyncHandler(async (req, res, next) => {
    const groups = await Group.findAll({
        where: {
            ownerId: { [Op.not]: req.user.id }
        },
        attributes: [
            'id',
            'name',
            'description'
        ],
        limit: 10
    })
    res.status(200).json({ success: true, data: groups })
})

exports.getAllMember = asyncHandler(async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId)
    const groupMembers = await GroupMember.findAll({
        // include: { model: User, attributes: ['id', 'avatar', 'username'] },
        where: {
            groupId: group.id
        }
    })
    groupMembers.forEach(async (groupMember, index) => {
        const member = await User.findByPk(groupMember.memberId, { attributes: ['id', 'username', 'avatar'] })
        groupMember.setDataValue('member', member)
        if (index === groupMembers.length - 1) {
            group.setDataValue('groupMembers', groupMembers)
            return res.status(200).json({ success: true, data: group })
        }
    })
    // res.status(200).json({ success: true, data: groupMember })
})