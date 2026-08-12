import { Bot } from "grammy";
import { prisma } from "@vpn-hub/database";
import { logger } from "@vpn-hub/logger";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN required");

const bot = new Bot(BOT_TOKEN);

bot.command("start", async (ctx) => {
  const ref = ctx.match;
  await prisma.user.upsert({
    where: { telegramId: String(ctx.from!.id) },
    create: { telegramId: String(ctx.from!.id), firstName: ctx.from!.first_name, lastName: ctx.from!.last_name ?? null, username: ctx.from!.username ?? null, referredById: null },
    update: {},
  });
  await ctx.reply("Welcome to VPN Config Hub", {
    reply_markup: { inline_keyboard: [[{ text: "Open App", web_app: { url: process.env.MINI_APP_URL ?? "https://example.com" } }]] },
  });
  if (typeof ref === "string" && ref.startsWith("ref_")) {
    const referrerTgId = ref.slice(4);
    const referrer = await prisma.user.findUnique({ where: { telegramId: referrerTgId } });
    if (referrer) await prisma.user.update({ where: { telegramId: String(ctx.from!.id) }, data: { referredById: referrer.id } });
  }
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on("message:successful_payment", async (ctx) => {
  const p = ctx.message.successful_payment;
  await prisma.transaction.update({ where: { payload: p.invoice_payload }, data: { status: "paid" } });
  await ctx.reply("Payment received. Your subscription is active.");
});

bot.catch((err) => logger.error({ err }, "bot error"));
bot.start();
logger.info("telegram bot started");
