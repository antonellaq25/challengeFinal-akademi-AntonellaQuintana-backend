const { check } = require("express-validator");
const { validationResult } = require("./validationResult");

const _studentIdRequired = check("studentId", "Student ID is required").notEmpty();
const _courseIdRequired = check("courseId", "Course ID is required").notEmpty();
const _scoreRequired = check("score", "Score is required").notEmpty();
const _scoreIsNumeric = check("score", "Score must be a number between 0 and 100").isFloat({ min: 1, max: 100 });
const _feedbackOptional = check("feedback", "Feedback must be a string").optional().isString();

const _scoreOptional = check("score", "Score must be a number between 0 and 100").optional().isFloat({ min: 1, max: 100 });
const _feedbackUpdateOptional = check("feedback", "Feedback must be a string").optional().isString();

const validateCreateGrade = [
  _studentIdRequired,
  _courseIdRequired,
  _scoreRequired,
  _scoreIsNumeric,
  _feedbackOptional,
  validationResult,
];

const validateUpdateGrade = [
  _scoreOptional,
  _feedbackUpdateOptional,
  validationResult,
];

module.exports = {
  validateCreateGrade,
  validateUpdateGrade,
};
