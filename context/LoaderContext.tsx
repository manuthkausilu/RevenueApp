import React, { createContext, useContext, useState } from "react"

interface LoaderContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined)

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  )
}

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return context
}

