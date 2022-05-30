import stripe from "stripe";
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY)
const YOUR_DOMAIN = 'http://localhost:3000'

const createNewSession = async (priceId, customerId) => {
  const session = await Stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    customer: customerId,
    client_reference_id: customerId,
    phone_number_collection: { enabled: true },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/success/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  })
  return session
}


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      try {
        const session = await Stripe.checkout.sessions.expire(
          req?.body?.stripeSessionId
        )
        if (session?.status == "expired") {
          const session = await createNewSession(req.body?.priceId, req.body?.customerId)
          return res.status(200).json(session)
        } else {
          return res.status(200).json(session)
        }
      } catch (e) {
        console.log(`Existing Session:: Error: ${e.message}`);
        try {
          const session = await createNewSession(req.body?.priceId, req.body?.customerId)
          return res.status(200).json(session)
        } catch (e) {
          console.log(`Session Create:: Error: ${e.message}`);
          return res.status(500).json({ statusCode: 500, message: e.message });
        }
      }
    } catch (e) {
      console.log(`Function Body:: Error: ${e.message}`);
      return res.status(500).json({ statusCode: 500, message: e.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }
};
