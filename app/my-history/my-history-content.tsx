"use client"

import { useState, useEffect } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { useAuth } from "@/context/auth-context"
import { userAPI, appointmentsAPI } from "@/lib/api"
import Image from "next/image"

export function MyHistoryContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [message, setMessage] = useState({ text: "", type: "" })

  // User profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "Утга байхгүй",
    phone: "Утга байхгүй",
    email: user?.email || "Утга байхгүй",
    address: "Утга байхгүй",
    birthdate: "Утга байхгүй",
    gender: "Утга байхгүй",
    allergies: "Утга байхгүй",
    bloodType: "Утга байхгүй",
  })

  // Fetch user profile and appointments
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsLoading(true)
        try {
          // Fetch user profile
          const profileResponse: any = await userAPI.getById(user.id)
          if (profileResponse.success) {
            setProfileData({
              name: profileResponse.user.name || "Утга байхгүй",
              phone: profileResponse.user.phone || "Утга байхгүй",
              email: profileResponse.user.email || "Утга байхгүй",
              address: profileResponse.user.address || "Утга байхгүй",
              birthdate: profileResponse.user.birthdate || "Утга байхгүй",
              gender: profileResponse.user.gender || "Утга байхгүй",
              allergies: profileResponse.user.allergies || "Утга байхгүй",
              bloodType: profileResponse.user.bloodType || "Утга байхгүй",
            })
          }

          // Fetch appointments
          const appointmentsResponse: any = await appointmentsAPI.getByUserId(user.id)
          if (appointmentsResponse.success) {
            // Ensure each appointment has a unique id
            const processedAppointments = appointmentsResponse.appointments.map((appointment: any, index: number) => ({
              ...appointment,
              // Use _id if available, otherwise use id, or generate a fallback id
              id: appointment._id || appointment.id || `appointment-${index}`,
            }))
            setAppointments(processedAppointments)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserData()
    }
  }, [user])

  const handleProfileChange = (e: any) => {
    const { name, value } = e.target
    setProfileData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const saveProfile = async () => {
    if (!user) return

    try {
      // Don't send "Утга байхгүй" values to the server
      const dataToSend = Object.fromEntries(
        Object.entries(profileData).filter(([key, value]) => value !== "Утга байхгүй"),
      )

      const response: any = await userAPI.updateProfile(user.id, dataToSend)
      if (response.success) {
        setIsEditing(false)
        setMessage({ text: "Хувийн мэдээлэл амжилттай хадгалагдлаа", type: "success" })

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" })
        }, 3000)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ text: "Хувийн мэдээлэл хадгалахад алдаа гарлаа", type: "error" })
    }
  }

  const cancelAppointment = async (appointmentId: any) => {
    try {
      // Show confirmation dialog
      if (!confirm("Та энэ цаг захиалгыг цуцлахдаа итгэлтэй байна уу?")) {
        return
      }

      setMessage({ text: "Цаг захиалга цуцлаж байна...", type: "info" })

      const response: any = await appointmentsAPI.cancel(appointmentId)

      if (response.success) {
        setMessage({ text: "Цаг захиалга амжилттай цуцлагдлаа", type: "success" })

        // Update the appointments list
        setAppointments((prev: any[]) =>
          prev.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, status: "Цуцалсан" } : appointment,
          ),
        )

        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" })
        }, 3000)
      } else {
        setMessage({
          text: response.message || "Цаг захиалга цуцлахад алдаа гарлаа",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      setMessage({
        text: "Цаг захиалга цуцлахад алдаа гарлаа. Дахин оролдоно уу.",
        type: "error",
      })
    }
  }

  // Helper function to check if a field has a value
  const hasValue = (value: string) => value !== "Утга байхгүй"

  return (
    <AuthWrapper requiredRole="client">
      <main className="my-history-page">
        <div className="page-banner">
          <h1>Миний түүх</h1>
          <p>Таны хувийн мэдээлэл, эмчилгээний түүх, цаг захиалга</p>
        </div>

        {message.text && (
          <div className={`message-container ${message.type}`}>
            <p>{message.text}</p>
          </div>
        )}

        <section className="history-section">
          <div className="history-container">
            <div className="history-tabs">
              <div className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                Хувийн мэдээлэл
              </div>
              <div
                className={`tab ${activeTab === "appointments" ? "active" : ""}`}
                onClick={() => setActiveTab("appointments")}
              >
                Цаг захиалга
              </div>
              <div
                className={`tab ${activeTab === "treatments" ? "active" : ""}`}
                onClick={() => setActiveTab("treatments")}
              >
                Эмчилгээний түүх
              </div>
            </div>

            <div className="tab-content">
              {activeTab === "profile" && (
                <div className="profile-section">
                  <h2>Хувийн мэдээлэл</h2>

                  <div className="profile-container">
                    <div className="profile-header">
                      <div className="profile-avatar">
                        <Image src="/doctor.png" alt="Profile" width={100} height={100} className="avatar-image" />
                      </div>
                      <div className="profile-name">
                        <h3>{profileData.name}</h3>
                        <p>Үйлчлүүлэгч ID: {user?.id || "Утга байхгүй"}</p>
                      </div>
                      <div className="profile-actions">
                        {isEditing ? (
                          <button className="button small" onClick={saveProfile}>
                            Хадгалах
                          </button>
                        ) : (
                          <button className="button small" onClick={() => setIsEditing(true)}>
                            Засах
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="profile-details">
                      {isEditing ? (
                        <div className="profile-form">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Нэр</label>
                              <input
                                type="text"
                                name="name"
                                value={hasValue(profileData.name) ? profileData.name : ""}
                                onChange={handleProfileChange}
                                placeholder="Нэрээ оруулна уу"
                              />
                            </div>
                            <div className="form-group">
                              <label>Утас</label>
                              <input
                                type="text"
                                name="phone"
                                value={hasValue(profileData.phone) ? profileData.phone : ""}
                                onChange={handleProfileChange}
                                placeholder="Утасны дугаараа оруулна уу"
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Имэйл</label>
                              <input
                                type="email"
                                name="email"
                                value={hasValue(profileData.email) ? profileData.email : ""}
                                onChange={handleProfileChange}
                                placeholder="Имэйл хаягаа оруулна уу"
                              />
                            </div>
                            <div className="form-group">
                              <label>Хаяг</label>
                              <input
                                type="text"
                                name="address"
                                value={hasValue(profileData.address) ? profileData.address : ""}
                                onChange={handleProfileChange}
                                placeholder="Хаягаа оруулна уу"
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Төрсөн огноо</label>
                              <input
                                type="date"
                                name="birthdate"
                                value={
                                  hasValue(profileData.birthdate) && profileData.birthdate.includes("-")
                                    ? profileData.birthdate
                                    : ""
                                }
                                onChange={handleProfileChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Хүйс</label>
                              <select
                                name="gender"
                                value={hasValue(profileData.gender) ? profileData.gender : ""}
                                onChange={handleProfileChange}
                              >
                                <option value="">Сонгоно уу</option>
                                <option value="Эрэгтэй">Эрэгтэй</option>
                                <option value="Эмэгтэй">Эмэгтэй</option>
                                <option value="Бусад">Бусад</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Харшил</label>
                              <input
                                type="text"
                                name="allergies"
                                value={hasValue(profileData.allergies) ? profileData.allergies : ""}
                                onChange={handleProfileChange}
                                placeholder="Харшилтай бол бичнэ үү"
                              />
                            </div>
                            <div className="form-group">
                              <label>Цусны бүлэг</label>
                              <select
                                name="bloodType"
                                value={hasValue(profileData.bloodType) ? profileData.bloodType : ""}
                                onChange={handleProfileChange}
                              >
                                <option value="">Сонгоно уу</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="profile-info">
                          <div className="info-row">
                            <div className="info-group">
                              <label>Нэр:</label>
                              <p className={!hasValue(profileData.name) ? "empty-value" : ""}>{profileData.name}</p>
                            </div>
                            <div className="info-group">
                              <label>Утас:</label>
                              <p className={!hasValue(profileData.phone) ? "empty-value" : ""}>{profileData.phone}</p>
                            </div>
                          </div>

                          <div className="info-row">
                            <div className="info-group">
                              <label>Имэйл:</label>
                              <p className={!hasValue(profileData.email) ? "empty-value" : ""}>{profileData.email}</p>
                            </div>
                            <div className="info-group">
                              <label>Хаяг:</label>
                              <p className={!hasValue(profileData.address) ? "empty-value" : ""}>
                                {profileData.address}
                              </p>
                            </div>
                          </div>

                          <div className="info-row">
                            <div className="info-group">
                              <label>Төрсөн огноо:</label>
                              <p className={!hasValue(profileData.birthdate) ? "empty-value" : ""}>
                                {profileData.birthdate}
                              </p>
                            </div>
                            <div className="info-group">
                              <label>Хүйс:</label>
                              <p className={!hasValue(profileData.gender) ? "empty-value" : ""}>{profileData.gender}</p>
                            </div>
                          </div>

                          <div className="info-row">
                            <div className="info-group">
                              <label>Харшил:</label>
                              <p className={!hasValue(profileData.allergies) ? "empty-value" : ""}>
                                {profileData.allergies}
                              </p>
                            </div>
                            <div className="info-group">
                              <label>Цусны бүлэг:</label>
                              <p className={!hasValue(profileData.bloodType) ? "empty-value" : ""}>
                                {profileData.bloodType}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appointments" && (
                <div className="appointments-list">
                  <h2>Цаг захиалгын түүх</h2>

                  {appointments.length > 0 ? (
                    <table className="appointments-table">
                      <thead>
                        <tr>
                          <th>Огноо</th>
                          <th>Цаг</th>
                          <th>Эмч</th>
                          <th>Үйлчилгээ</th>
                          <th>Төлөв</th>
                          <th>Төлбөр</th>
                          <th>Үйлдэл</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment, index) => (
                          <tr key={`appointment-${appointment.id || index}`}>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>
                            <td>{appointment.doctor}</td>
                            <td>{appointment.service}</td>
                            <td>
                              <span className={`status ${appointment.status === "Дууссан" ? "completed" : "upcoming"}`}>
                                {appointment.status}
                              </span>
                            </td>
                            <td>{appointment.cost}</td>
                            <td>
                              {appointment.status !== "Дууссан" && (
                                <button className="button small" onClick={() => cancelAppointment(appointment.id)}>
                                  Цуцлах
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-data-message">
                      <p>Цаг захиалгын түүх байхгүй байна.</p>
                      <button className="button" onClick={() => (window.location.href = "/book-online")}>
                        Цаг захиалах
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "treatments" && (
                <div className="treatments-list">
                  <h2>Эмчилгээний түүх</h2>

                  {appointments.length > 0 ? (
                    <div className="treatment-cards">
                      {appointments.map((appointment, index) => {
                        const [year, month, day] = appointment.date ? appointment.date.split("-") : ["", "", ""]
                        return (
                          <div className="treatment-card" key={`treatment-${appointment.id || index}`}>
                            <div className="treatment-date">
                              <div className="date-number">
                                <div className="month-day">{day}</div>
                                <div className="month-number">{month}</div>
                              </div>
                              <div className="treatment-info">
                                <div className="treatment-date-text">{appointment.date}</div>
                                <div className="treatment-doctor">Эмчлэгч эмч: {appointment.doctor}</div>
                                <div className="treatment-type">Үйлч: {appointment.service}</div>
                              </div>
                            </div>
                            <div className="treatment-details">
                              <p>
                                <strong>Онош:</strong> {appointment.diagnosis || "Мэдээлэл байхгүй"}
                              </p>
                              <p>
                                <strong>Эмчилгээ:</strong> {appointment.service}
                              </p>
                              <p>
                                <strong>Зөвлөмж:</strong> {appointment.notes || "Мэдээлэл байхгүй"}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="no-data-message">
                      <p>Эмчилгээний түүх байхгүй байна.</p>
                    </div>
                  )}

                  {appointments.length > 0 && (
                    <div className="pagination">
                      <span>1 - 5</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </AuthWrapper>
  )
}
