const { Sequelize,DataTypes } = require("sequelize");

module.exports = sequelize => 
    sequelize.define('Chat',{
        id:{
            type:DataTypes.UUID,
            allowNull:false,
            primaryKey:true,
            defaultValue:Sequelize.UUIDV4,
        },
        message: {
            type:DataTypes.STRING,
            allowNull:false,
        },
    })