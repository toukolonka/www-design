/* eslint-disable no-underscore-dangle */

const wokoutsRouter = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const Workout = require('../models/workout');
const Errors = require('../utils/errors');
const authorizeUser = require('../services/authorizationService');

wokoutsRouter.get('/', async (request, response, next) => {
  try {
    const user = await authorizeUser(request);

    const workouts = await Workout
      .find({ user: user._id, template: false })
      .sort({ date: 'desc' })
      .populate({
        path: 'sets',
        type: Array,
        populate: {
          path: 'exercise',
          model: 'Exercise',
        },
      });

    return response.json(workouts);
  } catch (err) {
    next(err);
  }
});

wokoutsRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await authorizeUser(request);

    const workout = await Workout
      .findById(request.params.id)
      .populate({
        path: 'sets',
        type: Array,
        populate: {
          path: 'exercise',
          model: 'Exercise',
        },
      });

    if (workout.user === null
      || workout.user.toString() === user._id.toString()) {
      return response.json(workout);
    }

    throw new Errors.AuthorizationError('Not authorized');
  } catch (err) {
    next(err);
  }
});

wokoutsRouter.post('/', async (request, response, next) => {
  try {
    const user = await authorizeUser(request);

    // Create new workout
    const workout = new Workout({
      date: new Date(),
      template: false,
      user: user._id,
      sets: [],
    });

    const savedWorkout = await workout.save();
    user.workouts = user.workouts.concat(savedWorkout._id);
    await user.save();

    return response.json(savedWorkout);
  } catch (err) {
    next(err);
  }
});

wokoutsRouter.post('/template/:id', async (request, response, next) => {
  try {
    const user = await authorizeUser(request);

    const template = await Workout.findById(request.params.id);

    const sets = template.sets.map((set) => ({
      weight: set.weight,
      repetitions: set.repetitions,
      completed: false,
      exercise: set.exercise,
      uuid: uuidv4(),
    }));

    const workout = new Workout({
      date: new Date(),
      template: false,
      user: user._id,
      sets,
    });

    const savedWorkout = await workout.save();
    user.workouts = user.workouts.concat(savedWorkout._id);
    await user.save();

    return response.json(savedWorkout);
  } catch (err) {
    next(err);
  }
});

wokoutsRouter.put('/:id', async (request, response, next) => {
  try {
    await authorizeUser(request);
    const { body } = request;

    const workout = {
      sets: body.sets.map((set) => ({
        weight: set.weight,
        repetitions: set.repetitions,
        completed: set.completed,
        exercise: set.exercise.id,
        uuid: set.uuid,
      })),
    };

    await Workout.findByIdAndUpdate(request.params.id, workout, { new: true });

    return response.status(204).end();
  } catch (err) {
    next(err);
  }
});

wokoutsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = await authorizeUser(request);
    const workout = await Workout.findById(request.params.id);

    if (user.id === workout.user.toString()) {
      const removedWorkout = await Workout.findByIdAndRemove(request.params.id);
      user.workouts = user.workouts.filter((w) => w._id !== removedWorkout._id);
      await user.save();
      return response.status(204).end();
    }

    throw new Errors.AuthorizationError('Not authorized');
  } catch (err) {
    next(err);
  }
});

module.exports = wokoutsRouter;
