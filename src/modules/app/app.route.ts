
import * as appController from './app.controller';
import { Hono } from 'hono';

export const r = new Hono();

r.get('/', appController.get);
r.post('/', appController.post);
