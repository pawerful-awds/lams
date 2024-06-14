import express, { Router } from 'express';

import { heartbeatRouter } from './healthCheck';
import { downloadRouter } from './download';

export const apiRouter = (): Router => {
  const router = express.Router();

  router.use('/v1/__heartbeat', heartbeatRouter);
  router.use('/v1/download', downloadRouter);

  return router;
};
