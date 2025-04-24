"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { doctorsAPI, servicesAPI, appointmentsAPI } from "@/lib/api"
import "./book-online.css"

export default function BookOnlinePage() {
  const searchParams = useSearchParams()
  const initialService = searchParams.get("service")
  const initialDoctor = searchParams.get("doctor")
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    service: initialService || "",
    doctor: initialDoctor || "",
    date: "",
    time: "",
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [services, setServices] = useState([])
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState("")

  // Fetch services and doctors
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch services
        const servicesResponse = await servicesAPI.getAll()
        if (servicesResponse.success) {
          setServices(
            servicesResponse.services.map((service: { id: { toString: () => any }; title: any }) => ({
              id: service.id.toString(),
              name: service.title,
            })),
          )
        }

        // Fetch doctors
        const doctorsResponse = await doctorsAPI.getAll()
        if (doctorsResponse.success) {
          setDoctors(
            doctorsResponse.doctors.map((doctor: { id: any; name: any; position: any }) => ({
              id: doctor.id,
              name: doctor.name,
              specialty: doctor.position,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Мэдээлэл ачааллахад алдаа гарлаа. Дахин оролдоно уу.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }))
    }
  }, [user])

  const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    
  ]

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!user) {
        // Redirect to sign in if not logged in
        router.push("/sign?redirect=book-online")
        return
      }

      const response = await appointmentsAPI.create({
        userId: user.id,
        doctorId: formData.doctor,
        date: formData.date,
        time: formData.time,
        service: services.find((s) => s.id === formData.service)?.name || "",
      })

      if (response.success) {
        setIsSuccess(true)
      } else {
        setError(response.message || "Цаг захиалахад алдаа гарлаа. Дахин оролдоно уу.")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      setError("Цаг захиалахад алдаа гарлаа. Дахин оролдоно уу.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="book-online-page">
          <div className="page-banner">
            <h1>Цаг захиалах</h1>
            <p>Та доорх маягтыг бөглөн цаг захиалах боломжтой</p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Уншиж байна...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="book-online-page">
        <div className="page-banner">
          <h1>Цаг захиалах</h1>
          <p>Та доорх маягтыг бөглөн цаг захиалах боломжтой</p>
        </div>

        {error && (
          <div className="error-container">
            <div className="error-message">{error}</div>
          </div>
        )}

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
