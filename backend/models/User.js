const Sequelize = require('sequelize').Sequelize;
const { DataTypes, Model } = require('sequelize');
const db = require('./dbconfig');

// points to table named 'Users' (auto-pluralized!)
class User extends Model { }
User.init({
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        unique: true
    },
    nickname: DataTypes.STRING,
}, {
    sequelize: db,
    modelName: 'User'
});

module.exports = User;