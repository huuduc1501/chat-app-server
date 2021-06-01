const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize =>
    sequelize.define('GroupChat', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })