import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { sentry } from '@hono/sentry'
import { compress } from 'hono/compress'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { poweredBy } from 'hono/powered-by'
import 'dotenv/config'

import { r as appRoute } from './modules/app/app.route';
import { r as authRoute } from './modules/auth/auth.route';

/* App */
const app = new Hono({ strict: false }).basePath('/api/v1');

/* Middlewares */
app.use('*', sentry({
  dsn: process.env.SENTRY_DSN,
}));
app.use(compress());
app.use(poweredBy());
app.use(logger());
app.use(prettyJSON({ space: 4 }));
/* Basics */
app.notFound((c) => {
  return c.json({ status: false, error: 'Not found' }, 404);
});
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ status: false, error: 'Internal server error' }, 500);
})

/* Routes */
app.route('/', appRoute);
app.route('/auth', authRoute);
const port = parseInt(process.env.PORT ?? '3000');
serve({
  fetch: app.fetch,
  port: port
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
});
