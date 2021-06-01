const { Sequelize, DataTypes } = require('sequelize')

module.exports = sequelize =>
    sequelize.define('GroupOwner', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
    })