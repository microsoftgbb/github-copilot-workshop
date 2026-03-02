/**
 * User Service - Enterprise JavaScript Sample
 *
 * This service manages user CRUD operations with validation,
 * error handling, and audit logging. Used in Module 2 exercises
 * for unit test generation with Copilot Chat.
 */

class UserNotFoundError extends Error {
  constructor(userId) {
    super(`User not found: ${userId}`);
    this.name = 'UserNotFoundError';
    this.userId = userId;
  }
}

class DuplicateEmailError extends Error {
  constructor(email) {
    super(`Email already in use: ${email}`);
    this.name = 'DuplicateEmailError';
    this.email = email;
  }
}

class ValidationError extends Error {
  constructor(field, message) {
    super(`Validation failed for ${field}: ${message}`);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class UserService {
  constructor(database, logger) {
    this.db = database;
    this.logger = logger;
  }

  /**
   * Retrieve all users with optional pagination.
   * @param {Object} options - { page: number, pageSize: number, sortBy: string, sortOrder: 'asc'|'desc' }
   * @returns {Promise<{ users: Array, total: number, page: number, pageSize: number }>}
   */
  async getAllUsers(options = {}) {
    const { page = 1, pageSize = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    if (page < 1) throw new ValidationError('page', 'must be at least 1');
    if (pageSize < 1 || pageSize > 100) throw new ValidationError('pageSize', 'must be between 1 and 100');

    this.logger.info('Fetching users', { page, pageSize, sortBy, sortOrder });

    const offset = (page - 1) * pageSize;
    const users = await this.db.query('users', {
      offset,
      limit: pageSize,
      orderBy: sortBy,
      order: sortOrder,
    });

    const total = await this.db.count('users');

    return {
      users,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Retrieve a single user by ID.
   * @param {string} userId - The user's unique identifier
   * @returns {Promise<Object>} The user object
   * @throws {UserNotFoundError} if user does not exist
   */
  async getUserById(userId) {
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('userId', 'must be a non-empty string');
    }

    this.logger.info('Fetching user', { userId });

    const user = await this.db.findById('users', userId);

    if (!user) {
      this.logger.warn('User not found', { userId });
      throw new UserNotFoundError(userId);
    }

    return user;
  }

  /**
   * Create a new user with validation.
   * @param {Object} userData - { name, email, department, role }
   * @returns {Promise<Object>} The created user with generated ID and timestamps
   * @throws {DuplicateEmailError} if email is already in use
   * @throws {ValidationError} if required fields are missing or invalid
   */
  async createUser(userData) {
    const { name, email, department, role = 'user' } = userData || {};

    // Validation
    if (!name || name.trim().length === 0) {
      throw new ValidationError('name', 'is required');
    }
    if (name.length > 100) {
      throw new ValidationError('name', 'must be 100 characters or fewer');
    }
    if (!email || !this._isValidEmail(email)) {
      throw new ValidationError('email', 'must be a valid email address');
    }
    if (!department || department.trim().length === 0) {
      throw new ValidationError('department', 'is required');
    }

    // Check for duplicate email
    const existingUser = await this.db.findOne('users', { email: email.toLowerCase() });
    if (existingUser) {
      this.logger.warn('Duplicate email attempt', { email });
      throw new DuplicateEmailError(email);
    }

    const newUser = {
      id: this._generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      department: department.trim(),
      role,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await this.db.insert('users', newUser);
    this.logger.info('User created', { userId: created.id, email: created.email });

    return created;
  }

  /**
   * Update an existing user.
   * @param {string} userId - The user's unique identifier
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated user
   * @throws {UserNotFoundError} if user does not exist
   * @throws {DuplicateEmailError} if new email is already in use by another user
   */
  async updateUser(userId, updates) {
    const user = await this.getUserById(userId);

    const allowedFields = ['name', 'email', 'department', 'role', 'active'];
    const sanitizedUpdates = {};

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = typeof value === 'string' ? value.trim() : value;
      }
    }

    if (sanitizedUpdates.email) {
      sanitizedUpdates.email = sanitizedUpdates.email.toLowerCase();
      if (!this._isValidEmail(sanitizedUpdates.email)) {
        throw new ValidationError('email', 'must be a valid email address');
      }
      const existingUser = await this.db.findOne('users', { email: sanitizedUpdates.email });
      if (existingUser && existingUser.id !== userId) {
        throw new DuplicateEmailError(sanitizedUpdates.email);
      }
    }

    if (sanitizedUpdates.name !== undefined && sanitizedUpdates.name.length === 0) {
      throw new ValidationError('name', 'cannot be empty');
    }

    sanitizedUpdates.updatedAt = new Date().toISOString();

    const updated = await this.db.update('users', userId, sanitizedUpdates);
    this.logger.info('User updated', { userId, fields: Object.keys(sanitizedUpdates) });

    return updated;
  }

  /**
   * Soft-delete a user by setting active to false.
   * @param {string} userId - The user's unique identifier
   * @returns {Promise<boolean>} true if user was deactivated
   * @throws {UserNotFoundError} if user does not exist
   */
  async deleteUser(userId) {
    const user = await this.getUserById(userId);

    if (!user.active) {
      this.logger.info('User already deactivated', { userId });
      return false;
    }

    await this.db.update('users', userId, {
      active: false,
      updatedAt: new Date().toISOString(),
    });

    this.logger.info('User deactivated', { userId });
    return true;
  }

  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  _generateId() {
    return `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

module.exports = { UserService, UserNotFoundError, DuplicateEmailError, ValidationError };
