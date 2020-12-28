const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data) {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  const username = !isEmpty(data.username) ? data.username : '';
  const password = !isEmpty(data.password) ? data.password : '';

  // Email checks
  if (Validator.isEmpty(username)) {
    errors.username = 'Username field is required.';
  }

  // Password checks
  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
