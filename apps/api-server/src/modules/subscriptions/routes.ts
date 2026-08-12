import type { FastifyInstance } from "fastify";
import { prisma } from "@vpn-hub/database";

export default async function subscriptionRoutes(app: FastifyInstance) {
  app.get("/", async (req) => {
    const userId = (req as { telegramUser: { user: { id: number } } }).telegramUser.user.id;
    return prisma.subscription.findMany({ where: { user: { telegramId: String(userId) } }, include: { plan: true, node: true } });
  });

  app.post("/", async (req, reply) => {
    const { planId, nodeId } = req.body as { planId: string; nodeId: string };
    const userId = (req as { telegramUser: { user: { id: number } } }).telegramUser.user.id;
    const user = await prisma.user.findUnique({ where: { telegramId: String(userId) } });
    if (!user) return reply.code(404).send({ error: "user not found" });
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return reply.code(404).send({ error: "plan not found" });
    return prisma.subscription.create({
      data: {
        userId: user.id,
        planId,
        nodeId,
        startsAt: new Date(),
        expiresAt: new Date(Date.now() + plan.durationDays * 86400 * 1000),
        quotaBytes: plan.trafficQuotaBytes,
      },
    });
  });
}
