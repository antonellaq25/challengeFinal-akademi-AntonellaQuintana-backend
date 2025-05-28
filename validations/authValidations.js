const { check } = require('express-validator');
const {validationResult} = require('./validationResult')

const _nameRequired = check('name', 'Name required').not().isEmpty();
const _emailRequired = check('email', 'Email required').not().isEmpty();
const _emailValid = check('email', 'Email is invalid').isEmail();
const _passwordRequired = check('password', 'Password required').not().isEmpty();

const validateUser = [
  _nameRequired,
  _emailRequired,
  _emailValid,
  _passwordRequired,
  validationResult
];

module.exports = {
 validateUser
};
