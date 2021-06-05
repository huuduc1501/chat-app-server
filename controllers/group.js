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
})

exports.searchGroup = asyncHandler(async (req, res, next) => {
    console.log(req.query.searchTerm)
    if (!req.query.searchTerm)
        return next({
            message: 'Vui lòng điền từ khóa tìm kiếm',
            statusCode: 400,
        })
    const groups = await Group.findAll({
        where: {
            [Op.or]: {
                name: {

                    [Op.substring]: req.query.searchTerm,

                },
                description: {
                    [Op.substring]: req.query.searchTerm
                }
            }
        },
        attributes: [
            'id',
            'name',
            'description',
            'createdAt',
        ],
    })
    res.status(200).json({ success: true, data: groups })
})