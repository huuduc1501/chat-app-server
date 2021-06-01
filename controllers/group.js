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
    const groupIds = await GroupMember.findAll({
        where: {
            memberId: req.user.id
        },
        attributes: ['groupId']
    })
    const groupIdList = groupIds.map(group => group.groupId)
    console.log(groupIdList)
    const groups = await Group.findAll({
        where: {
            id: {
                [Op.notIn]: groupIdList
            }
        },
        limit: 10,

    })

    res.status(200).json({ success: true, data: groups })
})


exports.getAllMember = asyncHandler(async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId)
    const memberIds = await GroupMember.findAll({
        // include: { model: User, attributes: ['id', 'avatar', 'username'] },
        where: {
            groupId: group.id
        }
    })
    const memberIdList = memberIds.map(member => member.memberId)
    const groupMembers = await User.findAll({
        where: {
            id: memberIdList
        },
        attributes: ['id', 'avatar', 'username']
    })
    group.setDataValue('groupMembers', groupMembers)
    res.status(200).json({ success: true, data: group })
    // memberIds.forEach(async (groupMember, index) => {
    //     const member = await User.findByPk(groupMember.memberId, { attributes: ['id', 'username', 'avatar'] })
    //     groupMember.setDataValue('member', member)
    //     if (index === memberIds.length - 1) {
    //         group.setDataValue('memberIds', memberIds)
    //         return res.status(200).json({ success: true, data: group })
    //     }
    // })
    // res.status(200).json({ success: true, data: groupMember })
})