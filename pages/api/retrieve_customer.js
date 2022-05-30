import stripe from "stripe"
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const customer = await Stripe.customers.retrieve(
        req?.body?.customerId
      )
      res.status(200).json(customer)
    } catch (e) {
      console.log(`Get Customer:: Error: ${e.message}`)
      res.status(500).json({ statusCode: 500, message: e.message })
    }
  } else {
    res.status(405).end("Method Not Allowed");
  }
}