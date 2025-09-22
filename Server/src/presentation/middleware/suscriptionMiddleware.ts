
import { Request, Response, NextFunction } from 'express';
import {Subscription} from '../../infrastructure/database/models/SuscriptionModel';

export async function fetchSubscription(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return next();
  if (user.currentSubscription) {
    const sub = await Subscription.findById(user.currentSubscription);
    (req as any).subscription = sub;
  }
  next();
}

export function requirePlan(allowedPlans: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const sub = (req as any).subscription;
    const planKey = sub?.planKey ?? 'free';
    if (!allowedPlans.includes(planKey)) {
      return res.status(403).json({ error: 'Upgrade required' });
    }
    next();
  };
}
