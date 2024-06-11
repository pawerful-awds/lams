import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pino } from 'pino';
import bodyParser from 'body-parser';

import { apiRouter } from '@/api';
import { graphqlServer } from '@/graphql';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Parses body with json
app.use(bodyParser.json());

// API Router
app.use(apiRouter());

// GraphQL Server
app.use(graphqlServer());

// Error handlers
app.use(errorHandler());

export { app, logger };
