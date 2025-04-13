"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/auth-context"

export function AuthWrapper({
  children,
  requiredRole,
  redirectTo = "/sign",
}: {
  children: React.ReactNode
  requiredRole?: "client" | "doctor" | "admin"
  redirectTo?: string
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const auth = useAuth()
  const { user, isLoading } = auth

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push(redirectTo)
      } else if (requiredRole && user.role !== requiredRole) {
        router.push(redirectTo)
      }
    }
  }, [user, isLoading, router, requiredRole, redirectTo, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Уншиж байна...</p>
      </div>
    )
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}

