"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "client" | "doctor" | "admin"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Create a default context value with proper types
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
}

// Initialize the context with the default value
const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    try {
      const storedUser = localStorage.getItem("dental_user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock users for demo
    const mockUsers = [
      { id: "1", name: "Client User", email: "client@example.com", password: "password", role: "client" as const },
      { id: "2", name: "Doctor User", email: "doctor@example.com", password: "password", role: "doctor" as const },
      { id: "3", name: "Admin User", email: "admin@example.com", password: "password", role: "admin" as const },
    ]

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      try {
        localStorage.setItem("dental_user", JSON.stringify(userWithoutPassword))
      } catch (error) {
        console.error("Error setting localStorage:", error)
      }
    } else {
      throw new Error("Invalid email or password")
    }

    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would send this data to your backend
    // For demo purposes, we'll just create a new user locally
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: "client" as const,
    }

    setUser(newUser)

    try {
      localStorage.setItem("dental_user", JSON.stringify(newUser))
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("dental_user")
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  // Create the context value object with the current state and functions
  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
