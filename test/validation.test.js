import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateEmail, validatePassword, validateLoginForm } from '../public/validation.js';

describe('Validation Module - TDD Test Suite', () => {
  describe('Email Validation (validateEmail)', () => {
    test('returns error when email is empty', () => {
      const result = validateEmail('');
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /email is required/i);
    });

    test('returns error when email lacks @ or domain', () => {
      const result1 = validateEmail('plainaddress');
      assert.strictEqual(result1.isValid, false);

      const result2 = validateEmail('missingdomain@');
      assert.strictEqual(result2.isValid, false);

      const result3 = validateEmail('user@nodot');
      assert.strictEqual(result3.isValid, false);
    });

    test('returns valid for well-formed email addresses', () => {
      const result1 = validateEmail('alex@example.com');
      assert.strictEqual(result1.isValid, true);
      assert.strictEqual(result1.error, '');

      const result2 = validateEmail('john.doe+test@sub.domain.org');
      assert.strictEqual(result2.isValid, true);
      assert.strictEqual(result2.error, '');
    });
  });

  describe('Password Validation (validatePassword)', () => {
    test('returns error when password is empty', () => {
      const result = validatePassword('');
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /password is required/i);
    });

    test('returns error when password is shorter than 8 characters', () => {
      const result = validatePassword('Pass1!');
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /at least 8 characters/i);
    });

    test('returns error when password has no uppercase letter', () => {
      const result = validatePassword('pass1234!');
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /uppercase/i);
    });

    test('returns error when password has no number', () => {
      const result = validatePassword('Password!');
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /number/i);
    });

    test('returns error when password has no special character', () => {
      const result = validatePassword('Password123');
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /special character/i);
    });

    test('returns valid when password meets all criteria', () => {
      const result = validatePassword('SecurePass123!');
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.error, '');
    });
  });

  describe('Complete Form Validation (validateLoginForm)', () => {
    test('rejects when both fields are empty', () => {
      const formResult = validateLoginForm({ email: '', password: '' });
      assert.strictEqual(formResult.isValid, false);
      assert.ok(formResult.errors.email);
      assert.ok(formResult.errors.password);
    });

    test('accepts valid credentials format', () => {
      const formResult = validateLoginForm({
        email: 'user@example.com',
        password: 'Password@2026'
      });
      assert.strictEqual(formResult.isValid, true);
      assert.deepStrictEqual(formResult.errors, {});
    });
  });
});
