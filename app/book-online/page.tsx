"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./book-online.css"

export default function BookOnlinePage() {
  const searchParams = useSearchParams()
  const initialService = searchParams.get("service")
  const initialDoctor = searchParams.get("doctor")

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    service: initialService || "",
    doctor: initialDoctor || "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const services = [
    { id: "1", name: "Шүдний цэвэрлэгээ" },
    { id: "2", name: "Шүдний ломбо" },
    { id: "3", name: "Шүдний суулгац" },
    { id: "4", name: "Шүдний гажиг засал" },
    { id: "5", name: "Шүдний цайралт" },
    { id: "6", name: "Хүүхдийн шүдний эмчилгээ" },
    { id: "7", name: "Яаралтай тусламж" },
    { id: "8", name: "Шүдний титэм, гүүр" },
  ]

  const doctors = [
    { id: "1", name: "Д. Болормаа", specialty: "Ерөнхий шүдний эмч" },
    { id: "2", name: "Б. Батбаяр", specialty: "Шүдний мэс засалч" },
    { id: "3", name: "Г. Оюунчимэг", specialty: "Шүдний гажиг засалч" },
    { id: "4", name: "Н. Энхбаяр", specialty: "Шүдний эмч" },
    { id: "5", name: "С. Мөнхзул", specialty: "Хүүхдийн шүдний эмч" },
    { id: "6", name: "Д. Ганбаатар", specialty: "Шүдний эмч" },
  ]

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  return (
    <>
      <Header />
      <main className="book-online-page">
        <div className="page-banner">
          <h1>Цаг захиалах</h1>
          <p>Та доорх маягтыг бөглөн цаг захиалах боломжтой</p>
        </div>

        {isSuccess ? (
          <section className="booking-success">
            <div className="success-container">
              <div className="success-icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <h2>Цаг захиалга амжилттай!</h2>
              <p>Таны цаг захиалга амжилттай бүртгэгдлээ. Бид тантай удахгүй холбогдох болно.</p>
              <div className="booking-details">
                <p>
                  <strong>Үйлчилгээ:</strong> {services.find((s) => s.id === formData.service)?.name}
                </p>
                <p>
                  <strong>Эмч:</strong> {doctors.find((d) => d.id === formData.doctor)?.name}
                </p>
                <p>
                  <strong>Огноо:</strong> {formData.date}
                </p>
                <p>
                  <strong>Цаг:</strong> {formData.time}
                </p>
              </div>
              <button className="button" onClick={() => window.location.reload()}>
                Шинэ цаг захиалах
              </button>
            </div>
          </section>
        ) : (
          <section className="booking-form-section">
            <div className="booking-container">
              <div className="booking-steps">
                <div className={`step ${step >= 1 ? "active" : ""}`}>
                  <div className="step-number">1</div>
                  <div className="step-text">Үйлчилгээ сонгох</div>
                </div>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  <div className="step-number">2</div>
                  <div className="step-text">Эмч сонгох</div>
                </div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  <div className="step-number">3</div>
                  <div className="step-text">Огноо, цаг сонгох</div>
                </div>
                <div className={`step ${step >= 4 ? "active" : ""}`}>
                  <div className="step-number">4</div>
                  <div className="step-text">Мэдээлэл оруулах</div>
                </div>
              </div>

              <div className="booking-form">
                {step === 1 && (
                  <div className="form-step">
                    <h2>Үйлчилгээ сонгоно уу</h2>
                    <div className="service-options">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className={`service-option ${formData.service === service.id ? "selected" : ""}`}
                          onClick={() => setFormData((prev) => ({ ...prev, service: service.id }))}
                        >
                          {service.name}
                        </div>
                      ))}
                    </div>
                    <div className="form-buttons">
                      <button className="button next-button" onClick={nextStep} disabled={!formData.service}>
                        Дараах
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-step">
                    <h2>Эмч сонгоно уу</h2>
                    <div className="doctor-options">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={`doctor-option ${formData.doctor === doctor.id ? "selected" : ""}`}
                          onClick={() => setFormData((prev) => ({ ...prev, doctor: doctor.id }))}
                        >
                          <div className="doctor-name">{doctor.name}</div>
                          <div className="doctor-specialty">{doctor.specialty}</div>
                        </div>
                      ))}
                    </div>
                    <div className="form-buttons">
                      <button className="button prev-button" onClick={prevStep}>
                        Өмнөх
                      </button>
                      <button className="button next-button" onClick={nextStep} disabled={!formData.doctor}>
                        Дараах
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="form-step">
                    <h2>Огноо, цаг сонгоно уу</h2>
                    <div className="date-time-selection">
                      <div className="form-group">
                        <label htmlFor="date">Огноо</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>

                      {formData.date && (
                        <div className="time-options">
                          <label>Боломжтой цагууд</label>
                          <div className="time-slots">
                            {availableTimes.map((time) => (
                              <div
                                key={time}
                                className={`time-slot ${formData.time === time ? "selected" : ""}`}
                                onClick={() => setFormData((prev) => ({ ...prev, time }))}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="form-buttons">
                      <button className="button prev-button" onClick={prevStep}>
                        Өмнөх
                      </button>
                      <button
                        className="button next-button"
                        onClick={nextStep}
                        disabled={!formData.date || !formData.time}
                      >
                        Дараах
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="form-step">
                    <h2>Мэдээлэл оруулна уу</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="name">Нэр</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Утасны дугаар</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Имэйл</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="notes">Нэмэлт тэмдэглэл</label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={4}
                        ></textarea>
                      </div>

                      <div className="form-buttons">
                        <button type="button" className="button prev-button" onClick={prevStep}>
                          Өмнөх
                        </button>
                        <button
                          type="submit"
                          className="button submit-button"
                          disabled={isSubmitting || !formData.name || !formData.phone || !formData.email}
                        >
                          {isSubmitting ? "Илгээж байна..." : "Цаг захиалах"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

