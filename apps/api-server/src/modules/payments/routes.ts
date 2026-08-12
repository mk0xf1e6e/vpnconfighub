import type { FastifyInstance } from "fastify";
import { prisma } from "@vpn-hub/database";
import { buildStarsInvoiceLink } from "@vpn-hub/telegram-sdk";

export default async function paymentRoutes(app: FastifyInstance) {
  app.post("/stars/invoice", async (req) => {
    const { planId, amount } = req.body as { planId: string; amount: number };
    const userId = (req as { telegramUser: { user: { id: number } } }).telegramUser.user.id;
    const payload = `${userId}:${planId}:${Date.now()}`;
    const tx = await prisma.transaction.create({
      data: { userId: String(userId), provider: "stars", amount, currency: "XTR", payload, status: "pending" },
    });
    return { invoiceLink: buildStarsInvoiceLink({ title: "VPN Plan", description: "Subscribe", payload: tx.payload, provider_token: "", currency: "XTR", prices: [{ label: "plan", amount }] }), txId: tx.id };
  });

  app.post("/stars/webhook", async (req, reply) => {
    const body = req.body as { pre_checkout_query_id?: string; successful_payment?: { invoice_payload: string; total_amount: number } };
    if (body.successful_payment) {
      await prisma.transaction.update({ where: { payload: body.successful_payment.invoice_payload }, data: { status: "paid" } });
      return { ok: true };
    }
    return reply.code(200).send({ ok: true });
  });
}
