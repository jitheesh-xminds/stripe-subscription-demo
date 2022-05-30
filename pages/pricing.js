import { PricingTable, PricingSlot, PricingDetail } from "react-pricing-table"
import axios from "axios"
import GetStripe from "../components/stripe/GetStripe"
import Router from "next/router"
import Styles from "../styles/Home.module.css"
import { useState, useEffect } from "react"

export default function Pricing() {

  const [stripeProductsList, setStripeProductsList] = useState([])
  const [stripePrices, setStripePrices] = useState([])

  useEffect(() => {
    getStripeProducts()
    getStripePrices()
  }, [])

  async function getStripeProducts() {
    const data = await axios.post("/api/list_products", {})
    setStripeProductsList(data?.data?.data)
  }

  async function getStripePrices() {
    const data = await axios.post("/api/list_prices", {})
    setStripePrices(data?.data?.data)

  }

  const matchingProductPrice = (priceId) => {
    const priceObj = stripePrices?.filter(item => item?.id == priceId).shift()
    return parseInt(priceObj?.unit_amount.toString().substring(0, priceObj.unit_amount.toString().length - 2))
  }

  const redirectToCheckOut = async (priceId) => {
    const {
      data: { id },
    } = await axios.post("/api/create-checkout-session", {
      priceId: priceId,
      customerId: localStorage.getItem("customerId"),
      stripeSessionId: localStorage.getItem("stripeSessionId")
    })
    localStorage.setItem("stripeSessionId", id)
    const stripe = await GetStripe()
    await stripe.redirectToCheckout({ sessionId: id })
  }



  return (
    <>
      {
        stripeProductsList.length > 0 && stripePrices?.length > 0
          ?
          <PricingTable highlightColor='#1976D2'>
            {
              stripeProductsList?.map((item, index) => {
                return (
                  <PricingSlot
                    key={index}
                    highlighted onClick={() => { redirectToCheckOut(item?.default_price) }}
                    buttonText=' SUBSCRIBE '
                    title={item?.name}
                    priceText={`${matchingProductPrice(item?.default_price).toLocaleString("en-US", { style: "currency", currency: "INR" })}/month`}
                  >
                    <PricingDetail> <b>{item?.metadata?.projects}</b> projects</PricingDetail>
                    <PricingDetail> <b>{item?.metadata?.storage}</b> storage</PricingDetail>
                    <PricingDetail> <b>{item?.metadata?.users}</b> users</PricingDetail>
                    <PricingDetail> <b>Time tracking</b></PricingDetail>
                  </PricingSlot>
                )
              })
            }
          </PricingTable>
          : <p>No data</p>
      }

    </>
  )
}
