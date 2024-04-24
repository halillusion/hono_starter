import { PrismaClient } from '@prisma/client';
/* cryptojs */
import crypto from 'crypto';

let prisma = new PrismaClient();

const UserModel = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  async createUser(data: any) {
    data.password = crypto.createHash('sha256').update(data.password).digest('hex').toString();
    return prisma.user.create({ data });
  },
  async updateUser(id: number, data: any) {
    return prisma.user.update({ where: { id }, data });
  },
  async deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};

const RefreshTokenModel = {
  async findTokenByUserId(userId: number) {
    return prisma.refresh_token.findFirst({ where: { userId } });
  },
  async createToken(data: any) {
    return prisma.refresh_token.create({ data });
  },
  async deleteToken(id: number) {
    return prisma.refresh_token.delete({ where: { id } });
  },
};

const SessionModel = {
  async findSessionByToken(token: string) {
    return prisma.session.findFirst({ where: { token } });
  },
  async createSession(data: any) {
    return prisma.session.create({ data });
  },
  async deleteSession(id: number) {
    return prisma.session.delete({ where: { id } });
  },
};

export { UserModel, RefreshTokenModel, SessionModel };