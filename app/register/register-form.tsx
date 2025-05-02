"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../../context/auth-context"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна.")
      return
    }

    if (password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.")
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
      router.push("/")
    } catch (err) {
      setError("Бүртгэл үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="header"></div>
      <div className="return_home">
        <a href="#">
          <i className="fa-solid fa-arrow-left" style={{ color: "var(--main-color1)" }}></i>{" "}
        </a>

        <Link href="/" style={{ color: "var(--main-color1)" }}>
          Нүүр хуудасруу шилжих
        </Link>
      </div>

      <div className="sign-form-container">
        <div className="sign-form-content">
          <h1>Бүртгүүлэх</h1>
          <p>Шинэ бүртгэл үүсгэхийн тулд доорх мэдээллийг бөглөнө үү.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="sign-form">
            <div className="form-group">
              <label htmlFor="name">Нэр</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Имэйл</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Нууц үг</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Нууц үг баталгаажуулах</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="button sign-button" disabled={isLoading}>
              {isLoading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>
          </form>

          <div className="register-link">
            <p>
              Бүртгэлтэй юу? <Link href="/sign">Нэвтрэх</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
