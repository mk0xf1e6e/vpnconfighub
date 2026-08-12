import type { FastifyInstance } from "fastify";
import { prisma } from "@vpn-hub/database";

export default async function nodeRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return prisma.vpnNode.findMany({ where: { isActive: true }, include: { inbounds: true } });
  });

  app.get("/:id/ping", async (req, reply) => {
    const { id } = req.params as { id: string };
    const node = await prisma.vpnNode.findUnique({ where: { id } });
    if (!node) return reply.code(404).send({ error: "not found" });
    const t0 = Date.now();
    try {
      await fetch(node.apiUrl, { method: "HEAD" });
      return { nodeId: id, latencyMs: Date.now() - t0, up: true };
    } catch {
      return { nodeId: id, latencyMs: -1, up: false };
    }
  });
}
