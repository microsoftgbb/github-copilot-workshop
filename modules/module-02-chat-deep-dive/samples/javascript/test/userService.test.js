/**
 * User Service Tests - Module 2 Exercise
 *
 * Use GitHub Copilot Chat to generate comprehensive tests for the UserService.
 *
 * Instructions:
 * 1. Open samples/javascript/src/userService.js (in this module folder)
 * 2. Select the UserService class
 * 3. Open Copilot Chat and use /tests to generate tests
 * 4. Copy the generated tests into this file
 * 5. Run: cd modules/module-02-chat-deep-dive/samples/javascript && npx jest
 *
 * Goal: Achieve comprehensive test coverage for all public methods
 * including happy paths, error cases, and edge cases.
 */

const { UserService, UserNotFoundError, DuplicateEmailError, ValidationError } = require('../src/userService');

// TODO: Use Copilot Chat to generate comprehensive tests
// Prompt suggestion:
//   /tests Generate comprehensive Jest tests for the UserService class.
//   Include:
//   - Tests for getAllUsers, getUserById, createUser, updateUser, deleteUser
//   - Mock the database dependency using jest.fn()
//   - Test error cases: user not found, duplicate email, invalid input
//   - Test edge cases: empty strings, very long names, special characters
//   - Follow AAA pattern (Arrange, Act, Assert)

describe('UserService', () => {
  // Your Copilot-generated tests go here
});
