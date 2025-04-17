"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"

export function FeedbackForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    subject: "",
    message: "",
    feedbackType: "suggestion",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would send the feedback to your backend
    console.log("Feedback submitted:", formData)

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <section className="feedback-section">
        <div className="feedback-success">
          <div className="success-icon">
            <i className="fa-solid fa-check"></i>
          </div>
          <h2>Баярлалаа!</h2>
          <p>
            Таны санал хүсэлтийг хүлээн авлаа. Бид таны саналыг анхааралтай судалж, үйлчилгээгээ сайжруулахад ашиглах
            болно.
          </p>
          <button className="button " style={{width:'30rem' }}  onClick={() => setIsSubmitted(false)}>
            Өөр санал хүсэлт илгээх
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="feedback-section">
      <div className="feedback-container">
        <div className="feedback-info">
          <h2>Таны санал хүсэлт чухал</h2>
          <p>
            Бид үйлчилгээгээ тасралтгүй сайжруулахыг зорьж байна. Таны санал хүсэлт, шүүмжлэл бидэнд маш их тусална. Та
            доорх маягтыг бөглөн илгээнэ үү.
          </p>

          <div className="contact-info">
            <div className="contact-item">
              <i className="fa-solid fa-phone"></i>
              <div>
                <h3>Утас</h3>
                <p>+976 77007700</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h3>Имэйл</h3>
                <p>info@dentalclinic.mn</p>
              </div>
            </div>

            <div className="contact-item">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <h3>Хаяг</h3>
                <p></p>
              </div>
            </div>
          </div>
        </div>

        <div className="feedback-form-container">
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="feedbackType">Санал хүсэлтийн төрөл</label>
              <select
                id="feedbackType"
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                required
              >
                <option value="suggestion">Санал хүсэлт</option>
                <option value="complaint">Гомдол</option>
                <option value="question">Асуулт</option>
                <option value="praise">Талархал</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Нэр</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Имэйл</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Утас</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Гарчиг</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Санал хүсэлт</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "Илгээж байна..." : "Илгээх"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
