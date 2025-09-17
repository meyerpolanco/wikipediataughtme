import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    email: string;
  };
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
      };
    }
  }
}
