"use client"

import { useState } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"

export function MyHistoryContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  
  // User profile state
  const [profile, setProfile] = useState({
    name: user?.name || "Нэргүй хэрэглэгч",
    phone: "99887766",
    email: user?.email || "example@mail.com",
    address: "Баянзүрх дүүрэг, 13-р хороолол",
    birthdate: "1990-01-01",
    gender: "Эрэгтэй",
    allergies: "Байхгүй",
    bloodType: "A+"
  })

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const saveProfile = () => {
    // Here you would typically save to backend
    setIsEditing(false)
  }

  const appointments = [
    {
      id: 1,
      date: "2023-11-15",
      time: "10:00",
      doctor: "Д. Болормаа",
      service: "Шүдний цэвэрлэгээ",
      status: "Дууссан",
      cost: "50,000₮",
      notes: "Дараагийн 6 сарын дараа шүдний цэвэрлэгээ хийлгэхийг зөвлөсөн",
      diagnosis: "Шүдний өнгөлгөө хийгдсэн",
    },
    {
      id: 2,
      date: "2023-12-20",
      time: "14:30",
      doctor: "Б. Батбаяр",
      service: "Шүдний ломбо",
      status: "Дууссан",
      cost: "85,000₮",
      notes: "Хатуу хоол идэхээс зайлсхийх",
      diagnosis: "36-р шүдний цоорол",
    },
    {
      id: 3,
      date: "2024-02-05",
      time: "11:15",
      doctor: "Д. Болормаа",
      service: "Шүдний үзлэг",
      status: "Дууссан",
      cost: "30,000₮",
      notes: "Шүдний утас ашиглахыг зөвлөсөн",
      diagnosis: "Шүдний эрүүл мэнд хэвийн",
    },
    {
      id: 4,
      date: "2024-04-10",
      time: "15:00",
      doctor: "Г. Оюунчимэг",
      service: "Шүдний гажиг засал",
      status: "Товлосон",
      cost: "120,000₮",
      notes: "Эмчилгээний явц хэвийн",
      diagnosis: "Шүдний гажиг",
    },
    {
      id: 5,
      date: "2024-05-20",
      time: "09:30",
      doctor: "Д. Болормаа",
      service: "Шүдний үзлэг",
      status: "Товлосон",
      cost: "30,000₮",
      notes: "Урьдчилан сэргийлэх үзлэг",
      diagnosis: "Үзлэг",
    },
  ]

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
              <div
                className={`tab ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
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
                        <p>Үйлчлүүлэгч ID: {user?.id || "12345"}</p>
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
                        <div className="profile-form">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Нэр</label>
                              <input 
                                type="text" 
                                name="name" 
                                value={profile.name} 
                                onChange={handleProfileChange} 
                              />
                            </div>
                            <div className="form-group">
                              <label>Утас</label>
                              <input 
                                type="text" 
                                name="phone" 
                                value={profile.phone} 
                                onChange={handleProfileChange} 
                              />
                            </div>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label>Имэйл</label>
                              <input 
                                type="email" 
                                name="email" 
                                value={profile.email} 
                                onChange={handleProfileChange} 
                              />
                            </div>
                            <div className="form-group">
                              <label>Хаяг</label>
                              <input 
                                type="text" 
                                name="address" 
                                value={profile.address} 
                                onChange={handleProfileChange} 
                              />
                            </div>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label>Төрсөн огноо</label>
                              <input 
                                type="date" 
                                name="birthdate" 
                                value={profile.birthdate} 
                                onChange={handleProfileChange} 
                              />
                            </div>
                            <div className="form-group">
                              <label>Хүйс</label>
                              <select 
                                name="gender" 
                                value={profile.gender} 
                                onChange={handleProfileChange}
                              >
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
                                value={profile.allergies} 
                                onChange={handleProfileChange} 
                              />
                            </div>
                            <div className="form-group">
                              <label>Цусны бүлэг</label>
                              <select 
                                name="bloodType" 
                                value={profile.bloodType} 
                                onChange={handleProfileChange}
                              >
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
                              <p>{profile.name}</p>
                            </div>
                            <div className="info-group">
                              <label>Утас:</label>
                              <p>{profile.phone}</p>
                            </div>
                          </div>
                          
                          <div className="info-row">
                            <div className="info-group">
                              <label>Имэйл:</label>
                              <p>{profile.email}</p>
                            </div>
                            <div className="info-group">
                              <label>Хаяг:</label>
                              <p>{profile.address}</p>
                            </div>
                          </div>
                          
                          <div className="info-row">
                            <div className="info-group">
                              <label>Төрсөн огноо:</label>
                              <p>{profile.birthdate}</p>
                            </div>
                            <div className="info-group">
                              <label>Хүйс:</label>
                              <p>{profile.gender}</p>
                            </div>
                          </div>
                          
                          <div className="info-row">
                            <div className="info-group">
                              <label>Харшил:</label>
                              <p>{profile.allergies}</p>
                            </div>
                            <div className="info-group">
                              <label>Цусны бүлэг:</label>
                              <p>{profile.bloodType}</p>
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
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
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
                            {appointment.status !== "Дууссан" && <button className="button small">Цуцлах</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "treatments" && (
                <div className="treatments-list">
                  <h2 style={{  }}>Эмчилгээний түүх</h2>

                  <div className="treatment-cards">
                    {appointments.map((appointment) => {
                      const [year, month, day] = appointment.date.split("-")
                      return (
                        <div className="treatment-card" key={appointment.id}>
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
                              <strong>Онош:</strong> {appointment.diagnosis}
                            </p>
                            <p>
                              <strong>Эмчилгээ:</strong> {appointment.service}
                            </p>
                            <p>
                              <strong>Зөвлөмж:</strong> {appointment.notes}
                            </p>
                          
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="pagination">
                    <span>1 - 5</span>
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
