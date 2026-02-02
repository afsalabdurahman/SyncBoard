import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    role: 'Member' | 'Admin' | 'SuperAdmin';
  };
}

export const roleMiddleware = (roles: Array<'Member' | 'Admin' | 'SuperAdmin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
      return;
    }
    next();
  };
};
