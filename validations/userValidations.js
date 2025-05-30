const { check } = require("express-validator");
const { validationResult } = require("./validationResult");

const _nameRequired = check("name", "Name is required").notEmpty();
const _emailRequired = check("email", "Email is required").notEmpty();
const _emailValid = check("email", "Email is invalid").isEmail();
const _passwordRequired = check("password", "Password is required").notEmpty();
const _passwordMinLength = check("password", "Password must be at least 6 characters").isLength({ min: 6 });


const validateCreateUser = [
  _nameRequired,
  _emailRequired,
  _emailValid,
  _passwordRequired,
  _passwordMinLength,
  validationResult,
];

const _nameOptional =  check("name", "Name cannot be empty").optional().notEmpty();
const _emailOptional =  check("email", "Email is invalid").optional().isEmail();
const _passwordOptional = check("password", "Password must be at least 6 characters").optional().isLength({ min: 6 });

const validateUpdateUser = [
  _nameOptional,
  _emailOptional,
  _passwordOptional,
  validationResult,
];

const validateRequestReset = [
  _emailRequired,
  _emailValid,
  validationResult,
];

const validateResetPassword = [
  _passwordRequired,
  _passwordMinLength,
  validationResult,
];

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateRequestReset,
  validateResetPassword,
};
