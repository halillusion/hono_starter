import { Handler } from 'hono'
import { UserModel, RefreshTokenModel } from './auth.model'
// hash
import { v4 as uuidv4 } from 'uuid';


export const signUp: Handler = async (c) => {
  const body = await c.req.parseBody()
  const email = body.email;
  const password = body.password;
  console.log(body)
  if (!email || !password) {
    return c.json({ status: false, error: 'Email and password are required' }, 400);
  }

  const user = await UserModel.findUserByEmail(email.toString());
  if (user) {
    return c.json({ status: false, error: 'Email already exists' }, 400);
  }

  const newUser = await UserModel.createUser({ email, password });
  const token = await RefreshTokenModel.createToken({ 
    user_id: (newUser.id).toString(),
    token: uuidv4(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days 
  });

  return c.json({ status: true, data: { user: newUser, token } });
}

