import { NextFunction, Request, Response } from 'express';
import { ContextRunner } from 'express-validator';

// eslint-disable-next-line @stylistic/max-len
export default (validations: ContextRunner[]) => async (req: Request, res: Response, next: NextFunction) => {
  /* eslint-disable no-restricted-syntax */
  // sequential processing, stops running validations chain if one fails.
  for (const validation of validations) {
    // eslint-disable-next-line no-await-in-loop
    const result = await validation.run(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
  }
  /* eslint-enable no-restricted-syntax */

  return next();
};
