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
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("dental_user")
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

