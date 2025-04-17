"use client"

import { AuthWrapper } from "@/components/auth-wrapper"
import Link from "next/link"


export function MyHistoryContent() {
  const appointments = [
    {
      id: 1,
      date: "2023-11-15",
      time: "10:00",
      doctor: "Д. Болормаа",
      service: "Шүдний цэвэрлэгээ",
      status: "Дууссан",
    },
    {
      id: 2,
      date: "2023-12-20",
      time: "14:30",
      doctor: "Б. Батбаяр",
      service: "Шүдний ломбо",
      status: "Дууссан",
    },
    {
      id: 3,
      date: "2024-02-05",
      time: "11:15",
      doctor: "Д. Болормаа",
      service: "Шүдний үзлэг",
      status: "Дууссан",
    },
    {
      id: 4,
      date: "2024-04-10",
      time: "15:00",
      doctor: "Г. Оюунчимэг",
      service: "Шүдний гажиг засал",
      status: "Товлосон",
    },
  ]

  const treatments = [
    {
      id: 1,
      date: "2023-11-15",
      doctor: "Д. Болормаа",
      diagnosis: "Шүдний өнгөлгөө хийгдсэн",
      treatment: "Шүдний цэвэрлэгээ",
      notes: "Дараагийн 6 сарын дараа шүдний цэвэрлэгээ хийлгэхийг зөвлөсөн",
      cost: "50,000₮",
    },
    {
      id: 2,
      date: "2023-12-20",
      doctor: "Б. Батбаяр",
      diagnosis: "36-р шүдний цоорол",
      treatment: "Шүдний ломбо",
      notes: "Хатуу хоол идэхээс зайлсхийх",
      cost: "85,000₮",
    },
    {
      id: 3,
      date: "2024-02-05",
      doctor: "Д. Болормаа",
      diagnosis: "Шүдний эрүүл мэнд хэвийн",
      treatment: "Шүдний үзлэг",
      notes: "Шүдний утас ашиглахыг зөвлөсөн",
      cost: "30,000₮",
    },
  ]

  return (
    <AuthWrapper requiredRole="client">
      <main className="my-history-page">
        <div className="page-banner ">
          <p>Таны эрүүл мэндийн түүх</p>
        
        </div>

        <section className="history-section">
          <div className="history-container">
            <div className="history-tabs">
              <div className="tab active">
              <Link href="/blog">Цаг захиалга</Link>
              </div>
              <div className="tab active">
              <Link href="/blog">Цаг захиалга</Link>
              </div>
              <div className="tab active">
              <Link href="/blog">Цаг захиалга</Link>
              </div>

              </div>
           

            <div className="tab-content">
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
                        <td>{appointment.status !== "Дууссан" && <button className="button small">Цуцлах</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="treatments-list" style={{ display: "none" }}>
                <h2>Эмчилгээний түүх</h2>

                <div className="treatments-grid">
                  {treatments.map((treatment) => (
                    <div className="treatment-card" key={treatment.id}>
                      <div className="treatment-header">
                        <h3>{treatment.treatment}</h3>
                        <span className="treatment-date">{treatment.date}</span>
                      </div>
                      <div className="treatment-details">
                        <p>
                          <strong>Эмч:</strong> {treatment.doctor}
                        </p>
                        <p>
                          <strong>Онош:</strong> {treatment.diagnosis}
                        </p>
                        <p>
                          <strong>Тэмдэглэл:</strong> {treatment.notes}
                        </p>
                        <p>
                          <strong>Төлбөр:</strong> {treatment.cost}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AuthWrapper>
  )
}
