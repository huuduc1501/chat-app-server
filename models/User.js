const { Sequelize, DataTypes } = require('sequelize')

module.exports = (sequelize) =>
    sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        avatar: {
            type: DataTypes.STRING,
            // allowNull:true,
            defaultValue: 'https://res.cloudinary.com/dpmxnehes/image/upload/v1622450374/chat-app/avatar_gw4qvc.png'

        },
        cover: {
            type: DataTypes.STRING,
            // allowNull:true,
            defaultValue: 'https://res.cloudinary.com/dpmxnehes/image/upload/v1622450481/chat-app/cover_qhl66o.png'

        }
    })