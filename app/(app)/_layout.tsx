import { Stack } from "expo-router"
import React from "react"

const AppLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Dashboard" }} />
    </Stack>
  )
}

export default AppLayout
