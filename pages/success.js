import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Box, Button, Link } from '@chakra-ui/react'

export default function success() {
  const [data, setData] = useState()
  const router = useRouter()
  useEffect(() => {
    getSessionById()
  }, [])

  const getSessionById = async () => {
    const data = await axios.post("/api/retrieve_session", {
      stripeSessionId: localStorage.getItem("stripeSessionId")
    })
    localStorage.setItem("subscriptionId", data?.data?.subscription)
    setData(data?.data)
  }

  return (
    <Box
      display="flex"
      flex={1}
      height="100vh"
      width="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={100}
    >
      {
        data &&
        <>
          <div>Payment Status : <span>{data?.status}</span></div>
          <Link href='/'>
            <Button>Go to Dashboard</Button>
          </Link>
        </>
      }

    </Box>

  )
}
