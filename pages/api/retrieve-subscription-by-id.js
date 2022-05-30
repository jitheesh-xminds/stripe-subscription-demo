import stripe from "stripe"
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const subscriptionItems = await Stripe.subscriptionItems.list({
                subscription: req.body?.subscriptionId,
            })
            res.status(200).json(subscriptionItems)
        } catch (e) {
            console.log(`Retrieve a Session:: Error: ${e.message}`)
            res.status(500).json({ statusCode: 500, message: e.message })
        }
    } else {
        res.status(405).end("Method Not Allowed");
    }
}