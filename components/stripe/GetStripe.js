import { loadStripe } from "@stripe/stripe-js"

let stripePromise = null
const GetStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe("pk_test_51JItKjSEAKARE39gAYcrcKe4qAwWqxKeM4eHyNKveoe01ZEoLydDHIC5JbvDM9TM28KZOjAOEckMXJ9P7Oe4gl3a00xs5QSbvZ")
  }
  return stripePromise
}

export default GetStripe