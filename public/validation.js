/**
 * Validation Module
 * Shared between client-side DOM script and server/test runner
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates an email string.
 * @param {string} email
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required.'
    };
  }

  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address (e.g., user@example.com).'
    };
  }

  return {
    isValid: true,
    error: ''
  };
}

/**
 * Validates a password string according to security rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 * @param {string} password
 * @returns {{ isValid: boolean, error: string }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password is required.'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long.'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter.'
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number.'
    };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character.'
    };
  }

  return {
    isValid: true,
    error: ''
  };
}

/**
 * Validates the complete login form inputs.
 * @param {{ email?: string, password?: string }} credentials
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateLoginForm(credentials = {}) {
  const emailResult = validateEmail(credentials.email || '');
  const passwordResult = validatePassword(credentials.password || '');

  const errors = {};
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

