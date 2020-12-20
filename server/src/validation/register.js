const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  const name = !isEmpty(data.name) ? data.name : '';
  const email = !isEmpty(data.email) ? data.email : '';
  const password = !isEmpty(data.password) ? data.password : '';
  const password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Name checks
  if (Validator.isEmpty(name)) {
    errors.name = 'Name field is required.';
  }

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

  if (Validator.isEmpty(password2)) {
    errors.password2 = 'Confirm password field is required.';
  }

  if (!Validator.isLength(password, { min: 12, max: 64 })) {
    errors.password = 'Password must be at least 12 characters.';
  }

  if (!Validator.equals(password, password2)) {
    errors.password2 = 'Passwords must match.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
