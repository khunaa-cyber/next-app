"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push("/")
    } else {
      alert("Нэвтрэхэд алдаа гарлаа")
    }
  }

  return (
    <main className="login-page">
      <h1>Нэвтрэх</h1>
      <input
        type="email"
        placeholder="Имэйл"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Нууц үг"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Нэвтрэх</button>
    </main>
  )
}
