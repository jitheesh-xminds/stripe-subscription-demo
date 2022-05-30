import stripe from "stripe"
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })
const YOUR_DOMAIN = 'http://localhost:3000'

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const products = await Stripe.products.list({
        limit: 3,
      });
      res.status(200).json(products)
    } catch (e) {
      console.log(`List Products:: Error: ${e.message}`)
      res.status(500).json({ statusCode: 500, message: e.message })
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}