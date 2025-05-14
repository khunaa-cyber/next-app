"use client"

import { useState, useEffect } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { useAuth } from "@/context/auth-context"
import { userAPI, appointmentsAPI } from "@/lib/api"
import Image from "next/image"

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  service: string;
  status: string;
  cost: string;
  diagnosis?: string;
  notes?: string;
}

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  birthdate: string;
  gender: string;
  allergies: string;
  bloodType: string;
}

export function MyHistoryContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    address: "",
    birthdate: "",
    gender: "",
    allergies: "",
    bloodType: "",
  })

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setIsLoading(true)
        try {
          const profileResponse = await userAPI.getById(user.id) as unknown
          if (
            typeof profileResponse === 'object' &&
            profileResponse !== null &&
            'success' in profileResponse &&
            (profileResponse as any).success
          ) {
            const u = (profileResponse as any).user
            setProfile({
              name: u.name,
              phone: u.phone,
              email: u.email,
              address: u.address,
              birthdate: u.birthdate?.split("T")[0] || "",
              gender: u.gender || "",
              allergies: u.allergies || "",
              bloodType: u.bloodType,
            })
          }

          const appointmentsResponse = await appointmentsAPI.getByUserId(user.id) as unknown
          if (
            typeof appointmentsResponse === 'object' &&
            appointmentsResponse !== null &&
            'success' in appointmentsResponse &&
            (appointmentsResponse as any).success
          ) {
            setAppointments((appointmentsResponse as any).appointments)
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

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // name is keyof UserProfile гэдгийг шалгана
    if (name in profile) {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const saveProfile = async () => {
    if (!user) return
    try {
      const response = await userAPI.updateProfile(user.id, profile) as unknown
      if (
        typeof response === 'object' &&
        response !== null &&
        'success' in response &&
        (response as any).success
      ) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const cancelAppointment = async (appointmentId: number) => {
    try {
      const response = await appointmentsAPI.cancel(appointmentId) as unknown
      if (
        typeof response === 'object' &&
        response !== null &&
        'success' in response &&
        (response as any).success
      ) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? { ...a, status: "Цуцалсан" } : a,
          ),
        )
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error)
    }
  }

  return (
    <AuthWrapper requiredRole="client">
      <main className="my-history-page">
        <div className="page-banner">
          <h1>Миний түүх</h1>
          <p>Таны хувийн мэдээлэл, эмчилгээний түүх, цаг захиалга</p>
        </div>

        <section className="history-section">
          <div className="history-container">
            <div className="history-tabs">
              {[
                ["profile", "Хувийн мэдээлэл"],
                ["appointments", "Цаг захиалга"],
                ["treatments", "Эмчилгээний түүх"],
              ].map(([tab, label]) => (
                <div
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === "profile" && (
                <div className="profile-section">
                  <h2>Хувийн мэдээлэл</h2>
                  <div className="profile-container">
                    <div className="profile-header">
                      <div className="profile-avatar">
                        <Image
                          src="/doctor.png"
                          alt="Profile"
                          width={100}
                          height={100}
                          className="avatar-image"
                        />
                      </div>
                      <div className="profile-name">
                        <h3>{profile.name}</h3>
                        <p>Үйлчлүүлэгч ID: {user?.id}</p>
                      </div>
                      <div className="profile-actions">
                        {isEditing ? (
                          <button className="button small" onClick={saveProfile}>Хадгалах</button>
                        ) : (
                          <button className="button small" onClick={() => setIsEditing(true)}>Засах</button>
                        )}
                      </div>
                    </div>

                    <div className="profile-details">
                      {isEditing ? (
                        <form className="profile-form">
                          {["name", "phone", "email", "address", "birthdate", "allergies"].map((field) => (
                            <div className="form-group" key={field}>
                              <label>{
                                {
                                  name: "Нэр",
                                  phone: "Утас",
                                  email: "Имэйл",
                                  address: "Хаяг",
                                  birthdate: "Төрсөн огноо",
                                  allergies: "Харшил",
                                }[field]
                              }</label>
                              <input
                                type={field === "birthdate" ? "date" : field === "email" ? "email" : "text"}
                                name={field}
                                value={profile[field] || ""}
                                onChange={handleProfileChange}
                              />
                            </div>
                          ))}

                          <div className="form-group">
                            <label>Хүйс</label>
                            <select
                              name="gender"
                              value={profile.gender}
                              onChange={handleProfileChange}
                            >
                              <option value="">Сонгоно уу</option>
                              <option value="Эрэгтэй">Эрэгтэй</option>
                              <option value="Эмэгтэй">Эмэгтэй</option>
                              <option value="Бусад">Бусад</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Цусны бүлэг</label>
                            <select
                              name="bloodType"
                              value={profile.bloodType}
                              onChange={handleProfileChange}
                            >
                              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                        </form>
                      ) : (
                        <div className="profile-info">
                          {Object.entries({
                            Нэр: profile.name,
                            Утас: profile.phone,
                            Имэйл: profile.email,
                            Хаяг: profile.address,
                            "Төрсөн огноо": profile.birthdate,
                            Хүйс: profile.gender,
                            Харшил: profile.allergies,
                            "Цусны бүлэг": profile.bloodType,
                          }).map(([label, value]) => (
                            <div className="info-group" key={label}>
                              <label>{label}:</label>
                              <p>{value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appointments" && (
                <div className="appointments-list">
                  <h2>Цаг захиалгын түүх</h2>
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
                      {appointments.map((a) => (
                        <tr key={a.id}>
                          <td>{a.date}</td>
                          <td>{a.time}</td>
                          <td>{a.doctor}</td>
                          <td>{a.service}</td>
                          <td>
                            <span className={`status ${a.status === "Дууссан" ? "completed" : "upcoming"}`}>
                              {a.status}
                            </span>
                          </td>
                          <td>{a.cost}</td>
                          <td>
                            {a.status !== "Дууссан" && a.status !== "Цуцалсан" && (
                              <button
                                className="button small"
                                onClick={() => cancelAppointment(a.id)}
                              >
                                Цуцлах
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "treatments" && (
                <div className="treatments-list">
                  <h2>Эмчилгээний түүх</h2>
                  <div className="treatment-cards">
                    {appointments.map((a) => {
                      const [year, month, day] = a.date.split("-")
                      return (
                        <div className="treatment-card" key={a.id}>
                          <div className="treatment-date">
                            <div className="date-number">
                              <div className="month-day">{day}</div>
                              <div className="month-number">{month}</div>
                            </div>
                            <div className="treatment-info">
                              <div className="treatment-date-text">{a.date}</div>
                              <div className="treatment-doctor">Эмч: {a.doctor}</div>
                              <div className="treatment-type">Үйлчилгээ: {a.service}</div>
                            </div>
                          </div>
                          <div className="treatment-details">
                            <p><strong>Онош:</strong> {a.diagnosis || "—"}</p>
                            <p><strong>Эмчилгээ:</strong> {a.service}</p>
                            <p><strong>Зөвлөмж:</strong> {a.notes || "—"}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </AuthWrapper>
  )
}