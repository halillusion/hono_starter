
import * as authController from './auth.controller';
import { Hono } from 'hono';

export const r = new Hono();

r.post('/sign-up', authController.signUp);
