"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "../../context/auth-context"

export function SignForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError("Имэйл эсвэл нууц үг буруу байна.")
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <div>
      <div className="header"></div>
      <div className="return_home">
      <a href="#">
      <i className="fa-solid fa-arrow-left"  style={{color:'var(--main-color1)'}}></i>          </a>

        <Link href="/" style={{color:'var(--main-color1)'}}>Нүүр хуудасруу шилжих</Link>
      </div>

      <div className="sign-form-container">
        <div className="sign-form-content">
        <h1 style={{ textAlign: 'center' }}>Нэвтрэх</h1>

          <p>Та өөрийн бүртгэлтэй имэйл хаяг болон нууц үгээ оруулна уу.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="sign-form">
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

            <div className="forgot-password">
              <Link href="/forgot-password">Нууц үгээ мартсан?</Link>
            </div>

            <button type="submit" className="button sign-button" disabled={isLoading}>
              {isLoading ? "Уншиж байна..." : "Нэвтрэх"}
            </button>
          </form>

          <div className="register-link">
            <p>
              Бүртгэлгүй юу? <Link href="/register">Бүртгүүлэх</Link>
            </p>
          </div>

          <div className="demo-accounts">
            <p>Туршилтын бүртгэл:</p>
            <ul>
              <li>Үйлчлүүлэгч: client@example.com / password</li>
              <li>Эмч: doctor@example.com / password</li>
              <li>Админ: admin@example.com / password</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="sign-form-container">
        <p className="sign-form-content">Өөрийн бүртгэлээ үүсгэснээр өөрийн үзлэгийн түүхийг харах боломжтой . Мөн та сэтгэгдэлээ үлдээх эрх үүснэ. </p>
      </div>
      </div>

      
  )
}

