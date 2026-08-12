import type { FastifyInstance } from "fastify";
import { prisma } from "@vpn-hub/database";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/login", async (req) => {
    const u = (req as { telegramUser: { user: { id: number; first_name: string; last_name?: string; username?: string; language_code?: string } } }).telegramUser.user;
    const user = await prisma.user.upsert({
      where: { telegramId: String(u.id) },
      create: { telegramId: String(u.id), firstName: u.first_name, lastName: u.last_name ?? null, username: u.username ?? null, languageCode: u.language_code ?? null },
      update: { firstName: u.first_name, lastName: u.last_name ?? null, username: u.username ?? null, languageCode: u.language_code ?? null },
    });
    return { id: user.id, isAdmin: user.isAdmin };
  });
}
