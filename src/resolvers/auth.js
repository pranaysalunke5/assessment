const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const REGISTER_SALT_ROUNDS = 10;

module.exports = {
  Query: {
    me: async (_, __, { prisma, user }) => {
      if (!user) throw new Error('Not authenticated');
      return prisma.user.findUnique({ where: { id: user.id } });
    }
  },

  Mutation: {
    register: async (_, { email, password }, { prisma }) => {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) throw new Error('Email already registered');
      const hashed = await bcrypt.hash(password, REGISTER_SALT_ROUNDS);
      const user = await prisma.user.create({ data: { email, password: hashed } });
      return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt.toISOString() };
    },

    login: async (_, { email, password }, { prisma }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return {
        token,
        user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt.toISOString() }
      };
    }
  }
};
