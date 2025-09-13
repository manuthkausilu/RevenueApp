import React from "react"
import { ActivityIndicator, Text, View } from "react-native"

interface LoaderProps {
  text?: string
  size?: "small" | "large"
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading...", size = "large" }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <ActivityIndicator size={size} color="#3b82f6" />
      <Text className="text-white mt-4 text-lg">{text}</Text>
    </View>
  )
}

export default Loader
export default Loader
