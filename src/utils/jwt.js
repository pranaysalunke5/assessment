const jwt = require('jsonwebtoken');

async function getUserFromToken(authHeader = '', prisma) {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (!payload?.id) return null;
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return null;
    return { id: user.id, email: user.email, role: user.role };
  } catch (err) {
    return null;
  }
}

module.exports = { getUserFromToken };

