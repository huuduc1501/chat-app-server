const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize =>
    sequelize.define('GroupMember', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
    })