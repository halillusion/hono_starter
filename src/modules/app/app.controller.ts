import { Handler } from 'hono'

export const get: Handler = async (c) => {
  return c.text('Welcome to Start!')
}

export const post: Handler = async (c) => {
  return c.json({ message: 'Welcome to Start!' })
}

