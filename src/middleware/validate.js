'use strict';

/**
 * Generic Joi validation middleware factory.
 *
 * @param {import('joi').ObjectSchema} schema - A Joi schema that validates the
 *   request payload.  The schema may describe any combination of:
 *     { body, query, params }
 * @param {'body'|'query'|'params'|'all'} [target='body'] - Which part of the
 *   request to validate.  Pass 'all' to validate body + query + params together.
 * @returns {Function} Express middleware
 *
 * On validation failure a 422 response is returned with the structured error
 * format used throughout this project.
 */
function validate(schema, target = 'body') {
  return function (req, res, next) {
    let dataToValidate;

    if (target === 'all') {
      dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params,
      };
    } else if (target === 'query') {
      dataToValidate = req.query;
    } else if (target === 'params') {
      dataToValidate = req.params;
    } else {
      dataToValidate = req.body;
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(422).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed.',
        errors,
      });
    }

    // Replace the validated (and stripped) values back onto the request
    if (target === 'all') {
      req.body = value.body !== undefined ? value.body : req.body;
      req.query = value.query !== undefined ? value.query : req.query;
      req.params = value.params !== undefined ? value.params : req.params;
    } else if (target === 'query') {
      req.query = value;
    } else if (target === 'params') {
      req.params = value;
    } else {
      req.body = value;
    }

    return next();
  };
}

module.exports = validate;
