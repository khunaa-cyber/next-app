"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/auth-context"

export function DoctorDashboardContent() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("appointments")

  // Initialize auth here to avoid conditional hook call
  const auth = useAuth()
  const { user, isLoading } = auth

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push("/sign")
      } else if (user.role !== "doctor") {
        router.push("/sign")
      }
    }
  }, [user, isLoading, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Уншиж байна...</p>
      </div>
    )
  }

  if (!user || user.role !== "doctor") {
    return null
  }

  const appointments = [
    {
      id: 1,
      date: "2024-04-05",
      time: "09:00",
      patient: "Б. Баясгалан",
      service: "Шүдний үзлэг",
      status: "Хүлээгдэж буй",
    },
    {
      id: 2,
      date: "2024-04-05",
      time: "10:30",
      patient: "Д. Сарангэрэл",
      service: "Шүдний ломбо",
      status: "Хүлээгдэж буй",
    },
    {
      id: 3,
      date: "2024-04-05",
      time: "13:00",
      patient: "Г. Батболд",
      service: "Шүдний цэвэрлэгээ",
      status: "Хүлээгдэж буй",
    },
    {
      id: 4,
      date: "2024-04-05",
      time: "15:30",
      patient: "С. Оюунтуяа",
      service: "Шүдний гажиг засал",
      status: "Хүлээгдэж буй",
    },
    {
      id: 5,
      date: "2024-04-06",
      time: "09:30",
      patient: "Н. Мөнхбат",
      service: "Шүдний үзлэг",
      status: "Хүлээгдэж буй",
    },
  ]

  const patients = [
    {
      id: 1,
      name: "Б. Баясгалан",
      age: 35,
      phone: "9911-2233",
      email: "bayasgalan@example.com",
      lastVisit: "2024-03-10",
    },
    {
      id: 2,
      name: "Д. Сарангэрэл",
      age: 28,
      phone: "9922-3344",
      email: "sarangerel@example.com",
      lastVisit: "2024-02-15",
    },
    {
      id: 3,
      name: "Г. Батболд",
      age: 42,
      phone: "9933-4455",
      email: "batbold@example.com",
      lastVisit: "2024-03-22",
    },
    {
      id: 4,
      name: "С. Оюунтуяа",
      age: 25,
      phone: "9944-5566",
      email: "oyuntuya@example.com",
      lastVisit: "2024-01-30",
    },
    {
      id: 5,
      name: "Н. Мөнхбат",
      age: 31,
      phone: "9955-6677",
      email: "munkhbat@example.com",
      lastVisit: "2024-03-05",
    },
  ]

  return (
    <main className="doctor-dashboard-page">
      <div className="dashboard-header">
        <h1>Эмчийн хэсэг</h1>
        <p>Сайн байна уу, {user?.name}!</p>
      </div>

      <section className="dashboard-content">
        <div className="dashboard-sidebar">
          <div className="doctor-info">
            <div className="doctor-avatar">
              <div className="avatar-placeholder">{user?.name.charAt(0)}</div>
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>

          <div className="dashboard-nav">
            <button
              className={`nav-item ${activeTab === "appointments" ? "active" : ""}`}
              onClick={() => setActiveTab("appointments")}
            >
              <i className="fa-solid fa-calendar-check"></i>
              Цаг захиалга
            </button>
            <button
              className={`nav-item ${activeTab === "patients" ? "active" : ""}`}
              onClick={() => setActiveTab("patients")}
            >
              <i className="fa-solid fa-user-group"></i>
              Үйлчлүүлэгчид
            </button>
            <button
              className={`nav-item ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              <i className="fa-solid fa-clock"></i>
              Хуваарь
            </button>
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fa-solid fa-user"></i>
              Миний мэдээлэл
            </button>
          </div>
        </div>

        <div className="dashboard-main">
          {activeTab === "appointments" && (
            <div className="appointments-section">
              <div className="section-header">
                <h2>Өнөөдрийн цаг захиалга</h2>
                <div className="date-selector">
                  <button className="date-nav">
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <span>2024-04-05</span>
                  <button className="date-nav">
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              <div className="appointments-list">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Цаг</th>
                      <th>Үйлчлүүлэгч</th>
                      <th>Үйлчилгээ</th>
                      <th>Төлөв</th>
                      <th>Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter((a) => a.date === "2024-04-05")
                      .map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{appointment.time}</td>
                          <td>{appointment.patient}</td>
                          <td>{appointment.service}</td>
                          <td>
                            <span className="status">{appointment.status}</span>
                          </td>
                          <td>
                            <button className="button small">Эхлүүлэх</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div className="patients-section">
              <div className="section-header">
                <h2>Үйлчлүүлэгчид</h2>
                <div className="search-box">
                  <input type="text" placeholder="Хайх..." />
                  <button>
                    <i className="fa-solid fa-search"></i>
                  </button>
                </div>
              </div>

              <div className="patients-list">
                <table className="patients-table">
                  <thead>
                    <tr>
                      <th>Нэр</th>
                      <th>Нас</th>
                      <th>Утас</th>
                      <th>Имэйл</th>
                      <th>Сүүлийн үзлэг</th>
                      <th>Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.email}</td>
                        <td>{patient.lastVisit}</td>
                        <td>
                          <button className="button small">Дэлгэрэнгүй</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="schedule-section">
              <div className="section-header">
                <h2>Миний хуваарь</h2>
              </div>

              <div className="schedule-calendar">
                <div className="calendar-header">
                  <h3>2024 оны 4-р сар</h3>
                </div>

                <div className="calendar-grid">
                  {/* Calendar would be implemented here */}
                  <div className="calendar-placeholder">
                    <p>Хуваарь харуулах хэсэг</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Миний мэдээлэл</h2>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Нэр</label>
                  <input type="text" value={user?.name} readOnly />
                </div>

                <div className="form-group">
                  <label>Имэйл</label>
                  <input type="email" value={user?.email} readOnly />
                </div>

                <div className="form-group">
                  <label>Мэргэжил</label>
                  <input type="text" value="Шүдний эмч" readOnly />
                </div>

                <div className="form-group">
                  <label>Туршлага</label>
                  <input type="text" value="10 жил" readOnly />
                </div>

                <div className="form-group">
                  <label>Мэргэшил</label>
                  <input type="text" value="Ерөнхий шүдний эмчилгээ" readOnly />
                </div>

                <button className="button">Мэдээлэл шинэчлэх</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

