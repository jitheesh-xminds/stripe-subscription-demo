import stripe from "stripe"
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })
const YOUR_DOMAIN = 'http://localhost:3000'

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const customerPortalSession = await Stripe.billingPortal.sessions.create({
        customer: req?.body?.customerId,
        return_url: YOUR_DOMAIN,
      })
      res.status(200).json(customerPortalSession)
    } catch (e) {
      console.log(`Customer Portal Session:: Error: ${e.message}`);
      res.status(500).json({ statusCode: 500, message: e.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}