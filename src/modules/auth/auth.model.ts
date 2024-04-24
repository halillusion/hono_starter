import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import dayjs from 'dayjs';

let prisma = new PrismaClient();

const UsersModel = {
  async findUserByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  },
  async createUser(data: any) {
    data.password = crypto.createHash('sha256').update(data.password).digest('hex').toString();
    data.created_at = dayjs().unix().toString();
    data.updated_at = null;
    return prisma.users.create({ data });
  },
  async updateUser(id: number, data: any) {
    data.updated_at = dayjs().unix().toString();
    return prisma.users.update({ where: { id }, data });
  },
  async deleteUser(id: number) {
    let data: any = {};
    data.status = 'deleted';
    data.updated_at = dayjs().unix().toString();
    return prisma.users.update({ where: { id }, data });
  },
};

const SessionsModel = {
  async findSessionByUserId(userId: number) {
    return prisma.sessions.findFirst({ where: { user_id: userId.toString() } });
  },
  async createSession(data: any) {
    return prisma.sessions.create({ data });
  },
  async deleteSession(id: number) {
    return prisma.sessions.delete({ where: { id } });
  },
};

export { UsersModel, SessionsModel };