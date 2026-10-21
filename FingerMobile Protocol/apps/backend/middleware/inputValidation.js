/* eslint-disable no-unused-vars */
/**
 * InputValidationMiddleware
 * Centralized input validation and sanitization for all API endpoints
 * Uses express-validator for schema-based validation
 */

const { body, param, query, header, validationResult } = require('express-validator');

class InputValidationMiddleware {

  /**
   * Handle validation errors consistently
   */
  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value,
          location: err.location
        }))
      });
    }

    next();
  }

  /**
   * Common validation rules for ID parameters
   */
  static validateId(paramName = 'id') {
    return [
      param(paramName)
        .isUUID()
        .withMessage(`Invalid ${paramName} format - must be UUID`),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate email addresses
   */
  static validateEmail(fieldName = 'email') {
    return [
      body(fieldName)
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email address is required'),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate phone numbers
   */
  static validatePhone(fieldName = 'phone') {
    return [
      body(fieldName)
        .optional()
        .isMobilePhone('any', { strictMode: false })
        .withMessage('Invalid phone number format'),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate string fields with length limits
   */
  static validateString(fieldName, options = {}) {
    const {
      required = true,
      minLength = 1,
      maxLength = 500,
      trim = true,
      pattern = null,
      message = `Invalid ${fieldName}`
    } = options;

    let validator = body(fieldName);

    if (!required) {
      validator = validator.optional();
    } else {
      validator = validator.notEmpty().withMessage(`${fieldName} is required`);
    }

    validator = validator
      .isString()
      .withMessage(`${fieldName} must be a string`)
      .isLength({
        min: minLength,
        max: maxLength
      })
      .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters`);

    if (trim) {
      validator = validator.trim();
    }

    if (pattern) {
      validator = validator.matches(pattern).withMessage(message);
    }

    return [validator, this.handleValidationErrors];
  }

  /**
   * Validate numeric fields
   */
  static validateNumber(fieldName, options = {}) {
    const {
      required = true,
      min = undefined,
      max = undefined,
      isInt = false,
      message = `Invalid ${fieldName}`
    } = options;

    let validator = body(fieldName);

    if (!required) {
      validator = validator.optional();
    }

    if (isInt) {
      validator = validator.isInt({ min, max }).withMessage(message);
    } else {
      validator = validator.isFloat({ min, max }).withMessage(message);
    }

    return [validator, this.handleValidationErrors];
  }

  /**
   * Validate boolean fields
   */
  static validateBoolean(fieldName = 'isActive') {
    return [
      body(fieldName)
        .optional()
        .isBoolean()
        .withMessage(`${fieldName} must be true or false`),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate date fields
   */
  static validateDate(fieldName, options = {}) {
    const {
      required = true,
      isISO8601 = true,
      minDate = null,
      maxDate = null
    } = options;

    let validator = body(fieldName);

    if (!required) {
      validator = validator.optional();
    }

    if (isISO8601) {
      validator = validator.isISO8601().withMessage(`${fieldName} must be a valid ISO 8601 date`);
    } else {
      validator = validator.isDate().withMessage(`${fieldName} must be a valid date`);
    }

    if (minDate) {
      validator = validator.custom((value) => {
        const date = new Date(value);
        const min = new Date(minDate);
        if (date < min) {
          throw new Error(`${fieldName} must be after ${minDate}`);
        }
        return true;
      });
    }

    if (maxDate) {
      validator = validator.custom((value) => {
        const date = new Date(value);
        const max = new Date(maxDate);
        if (date > max) {
          throw new Error(`${fieldName} must be before ${maxDate}`);
        }
        return true;
      });
    }

    return [validator, this.handleValidationErrors];
  }

  /**
   * Validate URL fields
   */
  static validateUrl(fieldName = 'url') {
    return [
      body(fieldName)
        .optional()
        .isURL({
          protocols: ['http', 'https'],
          require_protocol: true
        })
        .withMessage(`${fieldName} must be a valid HTTP/HTTPS URL`),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate file uploads (checks presence only - actual validation in multer)
   */
  static validateFile(fieldName = 'file', options = {}) {
    const { required = true } = options;

    return [(req, res, next) => {
      if (required && !req.file && !req.files) {
        return res.status(400).json({
          success: false,
          message: `${fieldName} is required`
        });
      }
      next();
    }];
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  static sanitizeHtml(fieldName) {
    return [
      body(fieldName)
        .optional()
        .escape()
        .withMessage(`${fieldName} contains invalid characters`),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .toInt()
        .withMessage('Page must be a positive integer'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .toInt()
        .withMessage('Limit must be between 1 and 100'),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate sorting parameters
   */
  static validateSorting(allowedFields = []) {
    return [
      query('sortBy')
        .optional()
        .isString()
        .trim(),
      query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be asc or desc'),
      (req, res, next) => {
        if (req.query.sortBy && allowedFields.length > 0) {
          if (!allowedFields.includes(req.query.sortBy)) {
            return res.status(400).json({
              success: false,
              message: `Invalid sort field. Allowed: ${allowedFields.join(', ')}`
            });
          }
        }
        next();
      }
    ];
  }

  /**
   * Validate currency codes
   */
  static validateCurrency(fieldName = 'currency') {
    return [
      body(fieldName)
        .optional()
        .isIn(['USD', 'EUR', 'GBP', 'NGN', 'FIC'])
        .withMessage('Invalid currency code'),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate status fields with allowed values
   */
  static validateStatus(fieldName = 'status', allowedValues = []) {
    return [
      body(fieldName)
        .optional()
        .isIn(allowedValues)
        .withMessage(`Invalid status. Allowed: ${allowedValues.join(', ')}`),
      this.handleValidationErrors
    ];
  }

  /**
   * Create composite validation for multiple fields
   */
  static createValidation(rules = []) {
    return [...rules, this.handleValidationErrors];
  }

  /**
   * Validate JSON object structure
   */
  static validateJsonObject(fieldName = 'metadata') {
    return [
      body(fieldName)
        .optional()
        .isObject()
        .withMessage(`${fieldName} must be a valid JSON object`),
      this.handleValidationErrors
    ];
  }

  /**
   * Validate array fields
   */
  static validateArray(fieldName, options = {}) {
    const {
      required = true,
      minLength = 0,
      maxLength = 100,
      itemType = 'string'
    } = options;

    let validator = body(fieldName);

    if (!required) {
      validator = validator.optional();
    }

    validator = validator
      .isArray({
        min: minLength,
        max: maxLength
      }).withMessage(`${fieldName} must be an array`);

    if (itemType === 'string') {
      validator = validator.custom((arr) => {
        if (arr.some(item => typeof item !== 'string')) {
          throw new Error(`All items in ${fieldName} must be strings`);
        }
        return true;
      });
    } else if (itemType === 'number') {
      validator = validator.custom((arr) => {
        if (arr.some(item => typeof item !== 'number')) {
          throw new Error(`All items in ${fieldName} must be numbers`);
        }
        return true;
      });
    }

    return [validator, this.handleValidationErrors];
  }
}

module.exports = InputValidationMiddleware;
