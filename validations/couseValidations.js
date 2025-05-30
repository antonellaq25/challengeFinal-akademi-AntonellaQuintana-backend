const { check, query } = require("express-validator");
const { validationResult } = require("./validationResult");


const _titleRequired = check("title", "Title is required").notEmpty();
const _descriptionRequired = check("description", "Description is required").notEmpty();
const _categoryRequired = check("category", "Category is required").notEmpty();
const _priceIsNumber = check("price", "Price must be a number").isNumeric();
const _maxStudentsIsInt = check("maxStudents", "Max students must be a positive integer").isInt({ min: 1 });

const _titleOptional = check("title", "Title must be a string").optional().isString();
const _descriptionOptional = check("description", "Description must be a string").optional().isString();
const _categoryOptional = check("category", "Category must be a string").optional().isString();
const _priceOptional = check("price", "Price must be a number").optional().isNumeric();
const _maxStudentsOptional = check("maxStudents", "Max students must be a positive integer").optional().isInt({ min: 1 });


const validateCreateCourse = [
  _titleRequired,
  _descriptionRequired,
  _categoryRequired,
  _priceIsNumber,
  _maxStudentsIsInt,
  validationResult,
];

const validateUpdateCourse = [
  _titleOptional,
  _descriptionOptional,
  _categoryOptional,
  _priceOptional,
  _maxStudentsOptional,
  validationResult,
];

module.exports = {
  validateCreateCourse,
  validateUpdateCourse,
};
