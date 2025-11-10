require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const { getUserFromToken } = require('./utils/jwt');
const config = require('./config');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const auth = req.headers.authorization || '';
      const user = await getUserFromToken(auth, prisma);
      return { prisma, user, config };
    },
  });

  const { url } = await server.listen({ port: PORT });
  console.log(`🚀 Server ready at ${url}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
