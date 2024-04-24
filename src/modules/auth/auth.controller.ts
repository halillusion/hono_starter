import { Handler } from 'hono'
import { UsersModel, SessionsModel } from './auth.model'
import dayjs from 'dayjs';
import ip from 'ip';
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

  const user = await UsersModel.findUserByEmail(email.toString());
  if (user) {
    return c.json({ status: false, error: 'Email already exists' }, 400);
  }

  const newUser = await UsersModel.createUser({ email, password });
  const ipAddress = ip.address();
  const token = await SessionsModel.createSession({ 
    user_id: (newUser.id).toString(),
    token: uuidv4(),
    expires_at: dayjs().add(30, 'days').unix().toString(),
    created_at: dayjs().unix().toString(),
    user_agent: c.req.header('User-Agent'),
    ip_address: ipAddress
  });

  return c.json({ status: true, data: { user: newUser, token } });
}

