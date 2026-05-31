import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch(MongooseError.CastError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(404).json({
      cause: 'Invalid id',
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
