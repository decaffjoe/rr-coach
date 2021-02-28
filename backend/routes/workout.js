const express = require("express"),
  router = express.Router();

const Workout = require("../models/Workout");
const { allExercises } = require("../models/Exercises");
const Progressions = require("../models/Progressions");

// Get all workouts (per user_id)
router.get("/", async function (req, res) {
  try {
    const workouts = await Workout.findAll({
      where: { user_id: req.query.user_id },
      attributes: ["workout_id", "createdAt"],
    });
    return res.json(workouts);
  } catch (error) {
    return res.status(400).json("Please submit a valid user id!");
  }
});

// Create new workout (per user_id)
router.post("/", async function (req, res) {
  try {
    let newWorkout = await Workout.create(req.body, { fields: ["user_id"] });
    newWorkout = newWorkout.toJSON();
    // client already has user_id, no need to return timestamps either
    delete newWorkout.user_id,
      delete newWorkout.updatedAt,
      delete newWorkout.createdAt;
    return res.json(newWorkout.workout_id);
  } catch (error) {
    return res.status(400).json("Please submit a valid user_id");
  }
});

// Download user's complete workout history
router.get("/history", async function (req, res) {
  try {
    const history = {};

    // Get all workout ids per user_id (query string param)
    const workouts = await Workout.findAll({
      where: { user_id: req.query.user_id },
      attributes: ["workout_id", "createdAt"],
    });

    for (let workout of workouts) {
      history[workout.createdAt] = {};
      // Get all exercise info per workout_id
      for (let [key, val] of Object.entries(allExercises)) {
        history[workout.createdAt][key.toLowerCase()] = await val.findAll({
          where: { workout_id: workout.workout_id },
          attributes: ["progression", "reps"],
        });
        // Convert progression ints into their actual names
        for (let set of history[workout.createdAt][key.toLowerCase()]) {
          set.progression = Progressions[key][set.progression].name;
        }
      }
    }

    return res.json(history);
  } catch (error) {
    return res.status(400).json(`Please submit a valid user id! ${error}`);
  }
});

module.exports = router;
