import express, { Router } from 'express';

import { heartbeatRouter } from './healthCheck';

export const apiRouter = (): Router => {
  const router = express.Router();

  router.use('/v1/__heartbeat', heartbeatRouter);

  return router;
};
