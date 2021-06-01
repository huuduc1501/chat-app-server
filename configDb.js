const { Sequelize } = require('sequelize')

const UserModel = require('./models/User')
const ChatModel = require('./models/Chat')
const GroupModel = require('./models/Group')
const GroupChatModel = require('./models/GroupChat')
// const GroupOwnerModel = require('./models/GroupOwner')
const GroupMemberModel = require('./models/groupMember')

console.log(process.env.DATABASE_URL)
const sequelize = new Sequelize('postgres://postgres:42717294@localhost:5432/chat-app', {
    logging: false,
});

(async () => sequelize.sync({ force: false }))()

const User = UserModel(sequelize)
const Chat = ChatModel(sequelize)
const Group = GroupModel(sequelize)
const GroupChat = GroupChatModel(sequelize)
// const GroupOwner = GroupOwnerModel(sequelize)
const GroupMember = GroupMemberModel(sequelize)

User.hasMany(Chat, {
    foreignKey: 'receiveId'
})
User.hasMany(Chat, {
    foreignKey: 'senderId',
})

User.hasMany(Group, { foreignKey: 'ownerId' })
Group.belongsTo(User, { foreignKey: 'ownerId' })

Group.hasMany(GroupChat, { foreignKey: 'groupId' })
User.hasMany(GroupChat, { foreignKey: 'senderId' })
GroupChat.belongsTo(User, { foreignKey: 'senderId' })

Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId' })
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'memberId' })


module.exports = { User, Chat, Group, GroupChat, GroupMember }