import stripe from "stripe"
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const prices = await Stripe.prices.list({
        limit: 10,
      });
      res.status(200).json(prices)
    } catch (e) {
      console.log(`List Prices:: Error: ${e.message}`)
      res.status(500).json({ statusCode: 500, message: e.message })
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}