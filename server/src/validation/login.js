const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateLoginInput(data) {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  const email = !isEmpty(data.email) ? data.email : '';
  const password = !isEmpty(data.password) ? data.password : '';

  // Email checks
  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required.';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid.';
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
