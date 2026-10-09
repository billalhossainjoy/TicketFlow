import { RequestHandler } from 'express';
import { AuthService } from './auth.service.js';
import { fromNodeHeaders } from 'better-auth/node';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  getCurrentUser: RequestHandler = async (req, res) => {
    const user = await this.authService.getCurrentUser(fromNodeHeaders(req.headers));

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).type('application/problem+json').json({
        title: 'Unauthorized',
        status: StatusCodes.UNAUTHORIZED,
        detail: 'Authentication is required.',
        requestId: res.locals.requestId,
      });
      return;
    }
    res.status(StatusCodes.OK).json({ user });
  };
}
