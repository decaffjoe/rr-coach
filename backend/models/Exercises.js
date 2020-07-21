const Sequelize = require('sequelize').Sequelize;
const { DataTypes, Model } = require('sequelize');
const db = require('./dbconfig');
const Workout = require('./Workout');

// Define all exercise category classes
class Pullup extends Model { }
class Squat extends Model { }
class Dip extends Model { }
class Hinge extends Model { }
class Row extends Model { }
class Pushup extends Model { }
class AntiExtension extends Model { }
class AntiRotation extends Model { }
class Extension extends Model { }

// String: Class of all exercise categories
const allExercises = {
    'Pullup': Pullup,
    'Squat': Squat,
    'Dip': Dip,
    'Hinge': Hinge,
    'Row': Row,
    'Pushup': Pushup,
    'AntiExtension': AntiExtension,
    'AntiRotation': AntiRotation,
    'Extension': Extension
};

// Same columns and settings for all exercise categories
const commonFields = {
    progression: DataTypes.SMALLINT,
    reps: DataTypes.SMALLINT,
    setNumber: {
        type: DataTypes.SMALLINT,
        unique: 'compositeIndex',
        allowNull: false
    },
    workout_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Workout,
            key: 'workout_id'
        },
        unique: 'compositeIndex',
        allowNull: false
    }
};

// Create all tables with respective model names
for (let [key, val] of Object.entries(allExercises)) {
    val.init(commonFields, {
        // no need for timestamps, check workout for those
        timestamps: false,
        sequelize: db,
        modelName: key
    });
}

module.exports = { Pullup, Squat, Dip, Hinge, Row, Pushup, AntiExtension, AntiRotation, Extension, allExercises };
