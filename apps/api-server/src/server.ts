import Fastify from "fastify";
import { verifyTelegramInitData, parseInitData } from "@vpn-hub/telegram-sdk";
import { logger } from "@vpn-hub/logger";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN required");

const app = Fastify({ logger: false });
app.log = logger as never;

app.addHook("preHandler", async (req, reply) => {
  if (req.url === "/health") return;
  const initData = req.headers["x-telegram-init-data"];
  if (typeof initData !== "string" || !verifyTelegramInitData(initData, BOT_TOKEN)) {
    return reply.code(401).send({ error: "unauthorized" });
  }
  (req as { telegramUser?: ReturnType<typeof parseInitData> }).telegramUser = parseInitData(initData);
});

app.get("/health", async () => ({ ok: true }));

app.register(async (instance) => {
  const { default: auth } = await import("./modules/auth/routes.js");
  instance.register(auth, { prefix: "/auth" });
});
app.register(async (instance) => {
  const { default: subscriptions } = await import("./modules/subscriptions/routes.js");
  instance.register(subscriptions, { prefix: "/subscriptions" });
});
app.register(async (instance) => {
  const { default: payments } = await import("./modules/payments/routes.js");
  instance.register(payments, { prefix: "/payments" });
});
app.register(async (instance) => {
  const { default: nodes } = await import("./modules/nodes/routes.js");
  instance.register(nodes, { prefix: "/nodes" });
});

const port = Number(process.env.PORT ?? 3001);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  logger.fatal(err, "api-server failed to start");
  process.exit(1);
});
