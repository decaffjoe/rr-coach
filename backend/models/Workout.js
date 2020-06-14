const Sequelize = require('sequelize').Sequelize;
const { DataTypes, Model } = require('sequelize');
const db = require('./dbconfig');
const User = require('./User');

class Workout extends Model {
    // can only be called on the Workout class
    static classLevelMethod() {
        return 'hello? is this the Workout class?'
    }
    // can only be called on something built from Workout
    getInfo() {
        return `workout_id: ${this.workout_id}, user_id: ${this.user_id}`;
    }
}
Workout.init({
    workout_id: {
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.UUID,
        references: { model: User, key: 'user_id' },
        allowNull: false,
        unique: false
    }
}, {
    sequelize: db,
    modelName: 'Workout'
});

module.exports = Workout;