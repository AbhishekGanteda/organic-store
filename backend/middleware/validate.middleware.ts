import { validationResult } from 'express-validator';

const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ errors: errors.array() });
  }
  next();
};

export default validateRequest;
