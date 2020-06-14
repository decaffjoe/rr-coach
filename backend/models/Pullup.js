const Sequelize = require('sequelize').Sequelize;
const { DataTypes, Model } = require('sequelize');
const db = require('./dbconfig');
const Workout = require('./Workout');

class Pullup extends Model { }
Pullup.init({
    progression: DataTypes.SMALLINT,
    reps: DataTypes.SMALLINT,
    set: {
        type: DataTypes.SMALLINT,
        unique: 'compositeIndex',
        allowNull: false
    },
    workout_id: {
        type: DataTypes.INTEGER,
        references: { model: Workout, key: 'workout_id' },
        unique: 'compositeIndex',
        allowNull: false
    }
}, {
    // no need for timestamps, check workout for those
    timestamps: false,
    sequelize: db,
    modelName: 'Pullup'
});

module.exports = Pullup;