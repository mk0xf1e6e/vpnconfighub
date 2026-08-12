import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@vpn-hub/database";
import { ThreeXUIAdapter, MarzbanAdapter, HiddifyAdapter } from "@vpn-hub/vpn-adapters";
import { logger } from "@vpn-hub/logger";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", { maxRetriesPerRequest: null });

const trafficQueue = new Queue("traffic-sync", { connection });
const disableQueue = new Queue("auto-disable", { connection });
const healthQueue = new Queue("node-health", { connection });

function adapterFor(node: { panelKind: string; apiUrl: string; apiKey: string }) {
  switch (node.panelKind) {
    case "3x-ui": return new ThreeXUIAdapter({ baseUrl: node.apiUrl, username: "admin", password: node.apiKey });
    case "marzban": return new MarzbanAdapter({ baseUrl: node.apiUrl, username: "admin", password: node.apiKey });
    case "hiddify": return new HiddifyAdapter({ baseUrl: node.apiUrl, apiKey: node.apiKey });
    default: throw new Error(`unknown panel: ${node.panelKind}`);
  }
}

new Worker("traffic-sync", async () => {
  const subs = await prisma.subscription.findMany({ where: { isActive: true }, include: { node: true } });
  for (const sub of subs) {
    try {
      const a = adapterFor(sub.node);
      const t = await a.getUserTraffic(sub.id);
      const used = BigInt(t.up) + BigInt(t.down);
      await prisma.subscription.update({ where: { id: sub.id }, data: { usedBytes: used } });
    } catch (err) {
      logger.error({ err, subId: sub.id }, "traffic sync failed");
    }
  }
}, { connection });

new Worker("auto-disable", async (job: Job) => {
  const { subscriptionId } = job.data as { subscriptionId: string };
  const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId }, include: { node: true } });
  if (!sub) return;
  if (sub.usedBytes >= sub.quotaBytes || sub.expiresAt < new Date()) {
    await adapterFor(sub.node).deleteUser(0, sub.id);
    await prisma.subscription.update({ where: { id: sub.id }, data: { isActive: false } });
  }
}, { connection });

new Worker("node-health", async () => {
  const nodes = await prisma.vpnNode.findMany({ where: { isActive: true } });
  await Promise.all(nodes.map(async (n) => {
    const t0 = Date.now();
    try {
      await fetch(n.apiUrl, { method: "HEAD" });
      logger.info({ node: n.name, latencyMs: Date.now() - t0 }, "node up");
    } catch {
      logger.warn({ node: n.name }, "node down");
    }
  }));
}, { connection });

await trafficQueue.add("tick", {}, { repeat: { every: 60_000 } });
await disableQueue.add("tick", {}, { repeat: { every: 120_000 } });
await healthQueue.add("tick", {}, { repeat: { every: 30_000 } });
logger.info("worker-service started");
