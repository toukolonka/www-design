/* eslint-disable no-underscore-dangle */

const exercisesRouter = require('express').Router();
const Exercise = require('../models/exercise');
const Errors = require('../utils/errors');

exercisesRouter.get('/', (_, response, next) => {
  try {
    Exercise.find({}).then((exercises) => {
      response.json(exercises);
    });
  } catch (err) {
    next(err);
  }
});

exercisesRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request;

    if (body.name === undefined || body.description === undefined) {
      throw new Errors.InvalidParametersError('Exercise name and description has to be provided');
    }

    const exercise = new Exercise({
      name: body.name,
      description: body.description,
    });

    const savedExercise = await exercise.save();

    response.json(savedExercise);
  } catch (err) {
    next(err);
  }
});

module.exports = exercisesRouter;
