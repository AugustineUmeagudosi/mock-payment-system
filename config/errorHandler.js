import 'dotenv/config';
import { Response } from '../src/utils/index';

module.exports = function errorHandler ( error, _req, res ) {
    let code = error.statusCode ? error.statusCode : 500;
    let message = "Ops!. Something went south :(";
    
    logger.error(error.message);

    if(process.env.NODE_ENV !== 'production') return Response.error(res, error.message, code);
    return Response.error(res, message, code);
};