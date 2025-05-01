"use client"

import Image from "next/image"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./doctor.css"

export default function DoctorsPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const branches = ["Салбар 1", "Салбар 2", "Салбар 3", "Салбар 4"]
  const [expandedDoctorId, setExpandedDoctorId] = useState<number | null>(null)
  const toggleExpand = (id: number) => {
    setExpandedDoctorId(expandedDoctorId === id ? null : id)
  }
  const doctors = [
    {
      id: 1,
      name: "Д. Болормаа",
      position: "Ерөнхий шүдний эмч",
      branch: "Салбар 1",
      experience: "15 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний ломбо, цэвэрлэгээ, яаралтай тусламж",
      image: "/doctor-1.jpg",
      details: `
      Боловсрол, мэргэшлийн зэрэг:
      • 2003-2008 он: ЭМШУИС – Нүүр амны их эмч
      • 2010-2011 он: Согог засал /Prosthodontics/
      • 2017-2019 он: Хүүхдийн нүүр амны их эмч

      Ажлын туршлага:
      • 2009: Нарандентал – Дагалдан эмч
      • 2010: Ач АУДС – Туслах ажилтан
      • 2012-2017: Их зайсан – Хиймэл шүдний эмч
      • 2019: Удвал Медикал – Хүүхдийн нүүр амны эмч
      • 2020 - одоо: Кутикул Сансар – Хүүхдийн нүүр амны эмч
    `,
    },
    {
      id: 2,
      name: "Б. Батбаяр",
      position: "Шүдний мэс засалч",
      branch: "Салбар 2",
      experience: "12 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний мэс заслын тэнхим",
      specialization: "Шүдний мэс засал, имплант, эрүүний гажиг",
      image: "/doctor-2.jpg",
    },
    {
      id: 3,
      name: "Г. Оюунчимэг",
      position: "Гажиг засалч",
      branch: "Салбар 3",
      experience: "10 жилийн туршлагатай",
      education: "АШУҮИС, Гажиг заслын тэнхим",
      specialization: "Шүдний гажиг засал, хүүхдийн шүдний эмчилгээ",
      image: "/doctor-3.jpg",
    },
    {
      id: 4,
      name: "С. Мөнхзул",
      position: "Хүүхдийн шүдний эмч",
      branch: "Салбар 1",
      experience: "7 жилийн туршлагатай",
      education: "АШУҮИС, Хүүхдийн шүдний эмчилгээний тэнхим",
      specialization: "Хүүхдийн шүдний эмчилгээ, урьдчилан сэргийлэх эмчилгээ",
      image: "/doctor-5.jpg",
    },
    {
      id: 5,
      name: "Д. Ганбаатар",
      position: "Шүдний эмч",
      branch: "Салбар 4",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/doctor-6.jpg",
    },
    {
      id: 6,
      name: "Д. Ариунбаяр",
      position: "Гажиг засалч",
      branch: "Салбар 1",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/doctor-1.jpg",
    },
    {
      id: 7,
      name: "Д. Ганшагай",
      position: "Шүдний эмч",
      branch: "Салбар 2",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/doctor-2.jpg",
    },
    {
      id: 8,
      name: "Д. Золзаяа",
      position: "Хүүхдийн шүдний эмч",
      branch: "Салбар 3",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Хүүхдийн шүдний эмчилгээ, урьдчилан сэргийлэх эмчилгээ",
      image: "/doctor-3.jpg",
    },
    {
      id: 9,
      name: "Д. Баяржаргал",
      position: "Шүдний мэс засалч",
      branch: "Салбар 4",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний мэс засал, имплант, эрүүний гажиг",
      image: "/doctor-4.jpg",
    },
    {
      id: 10,
      name: "Д. Эрдэнэцэцэг",
      position: "Шүдний эмч",
      branch: "Салбар 1",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/doctor-1.jpg",
    },
    {
      id: 11,
      name: "Д. Батболд",
      position: "Шүдний эмч",
      branch: "Салбар 2",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/doctor-6.jpg",
    },
    {
      id: 12,
      name: "Д. Анар",
      position: "Шүдний эмч",
      branch: "Салбар 3",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/doctor-3.jpg",
    },
    {
      id: 13,
      name: "Д. Мөнхзаяа",
      position: "Шүдний эмч",
      branch: "Салбар 4",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/doctor-4.jpg",
    },
  ]

  const filteredDoctors = selectedBranch ? doctors.filter((d) => d.branch === selectedBranch) : doctors

  return (
    <>
      <Header />
      <main className="doctors-page">
        <div className="page-banner">
          <h1>Манай эмч нар</h1>
          <p>Манай мэргэжлийн, туршлагатай эмч нар таны шүдний эрүүл мэндийн төлөө үйлчилнэ</p>
        </div>

        <section className="filter-section">
          <h3>Салбар сонгох:</h3>
          <div className="filter-buttons">
            <button onClick={() => setSelectedBranch("")} className={selectedBranch === "" ? "active" : ""}>
              Бүгд
            </button>
            {branches.map((branch) => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={selectedBranch === branch ? "active" : ""}
              >
                {branch}
              </button>
            ))}
          </div>
        </section>

        <section className="doctors-list">
          <div className="doctors-grid">
            {filteredDoctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-image">
                  <Image src={doctor.image} alt={doctor.name} width={250} height={300} className="doctor-img" />
                </div>
                <div className="doctor-details">
                  <h2>{doctor.name}</h2>
                  <h3>{doctor.position}</h3>
                  <p>
                    <strong>Туршлага:</strong> {doctor.experience}
                  </p>
                  <p>
                    <strong>Боловсрол:</strong> {doctor.education}
                  </p>
                  <p>
                    <strong>Мэргэшил:</strong> {doctor.specialization}
                  </p>
                  <p>
                    <strong>Ажиллаж буй салбар:</strong> {doctor.branch}
                  </p>
                  <button className="button" onClick={() => toggleExpand(doctor.id)}>
                    {expandedDoctorId === doctor.id ? "Хураах" : "Дэлгэрэнгүй"}
                  </button>

                  {expandedDoctorId === doctor.id && doctor.details && (
                    <div className="doctor-extra">
                      {doctor.details.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                      <div className="contact-info">
                        <p>
                          <strong>Ажлын цаг:</strong> Даваа - Баасан 09:00 - 20:00
                        </p>
                        <p>
                          <strong>Утас:</strong> +976 - 70003931
                        </p>
                        <p>
                          <strong>Имэйл:</strong> info@cuticul.mn
                        </p>
                        <div className="social">
                          <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Youtube</a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
