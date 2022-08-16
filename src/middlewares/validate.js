import { Response } from '../utils';

/**
 * Middleware to validate payload
 * @param {Request} schema - The format of the joi validation.
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {function} next - Call the next operation.
 * @returns {object} - Returns an object (error or response).
 * @memberof ValidateMiddleware
 */
export const validateData = (schema) => async(req, res, next) => {
  try {
    const isValid = await validateSchema(req.body, schema);
    if (!isValid.error) {
      return next();
    }
    const { message } = isValid.error.details[0];
    return Response.error(res, message.replace(/["]/gi, ''), 400);
  } catch (error) {
    logger.error(error);
    return Response.error(res, 'Error validating payload');
  }
};

/**
 * Middleware to validate query parameters
 * @param {Request} schema - The format of the joi validation.
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {function} next - Call the next operation.
 * @returns {object} - Returns an object (error or response).
 * @memberof ValidateMiddleware
 */
 export const validateQuery = (schema) => async(req, res, next) => {
  try {
    const isValid = await validateSchema(req.query, schema);
    if (!isValid.error) {
      return next();
    }
    const { message } = isValid.error.details[0];
    return Response.error(res, message.replace(/["]/gi, ''), 400);
  } catch (error) {
    logger.error(error);
    return Response.error(res, 'Error validating payload');
  }
};

/**
 * Utility to validate schema
 * @param {Request} schema - The format of the joi validation.
 * @param {Request} data - The request from the endpoint.
 * @returns {object} - Returns an object (error or response).
 * @memberof ValidateMiddleware
 */
const validateSchema= async(data, schema) => {
  try {
    const options = {
      language: {
        key: '{{key}} ',
      },
    };
    return await schema.validate(data, options);
  } catch (error) {
    logger.error(error);
    return error;
  }
};
