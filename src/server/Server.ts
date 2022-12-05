import express from 'express';

import './shared/services/TranslationsYup';
import { router } from './routes/intex';

const server = express();

server.use(express.json());

server.use(router);

export { server };
