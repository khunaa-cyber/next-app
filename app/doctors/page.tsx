import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./doctor.css"

export default function DoctorsPage() {
  const doctors = [
    {
      id: 1,
      name: "Д. Болормаа",
      position: "Ерөнхий шүдний эмч",
      experience: "15 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний ломбо, цэвэрлэгээ, яаралтай тусламж",
      image: "/images/doctor-1.jpg",
    },
    {
      id: 2,
      name: "Б. Батбаяр",
      position: "Шүдний мэс засалч",
      experience: "12 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний мэс заслын тэнхим",
      specialization: "Шүдний мэс засал, имплант, эрүүний гажиг",
      image: "/images/doctor-2.jpg",
    },
    {
      id: 3,
      name: "Г. Оюунчимэг",
      position: "Шүдний гажиг засалч",
      experience: "10 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний гажиг заслын тэнхим",
      specialization: "Шүдний гажиг засал, хүүхдийн шүдний эмчилгээ",
      image: "/images/doctor-3.jpg",
    },
    {
      id: 4,
      name: "Н. Энхбаяр",
      position: "Шүдний эмч",
      experience: "8 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний цайралт, гоо сайхны шүдний эмчилгээ",
      image: "/images/doctor-4.jpg",
    },
    {
      id: 5,
      name: "С. Мөнхзул",
      position: "Хүүхдийн шүдний эмч",
      experience: "7 жилийн туршлагатай",
      education: "АШУҮИС, Хүүхдийн шүдний эмчилгээний тэнхим",
      specialization: "Хүүхдийн шүдний эмчилгээ, урьдчилан сэргийлэх эмчилгээ",
      image: "/images/doctor-5.jpg",
    },
    {
      id: 6,
      name: "Д. Ганбаатар",
      position: "Шүдний эмч",
      experience: "9 жилийн туршлагатай",
      education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
      specialization: "Шүдний суулгац, титэм, гүүр",
      image: "/images/doctor-6.jpg",
    },
  ]

  return (
    <>
      <Header />
      <main className="doctors-page">
        <div className="page-banner">
          <h1>Манай эмч нар</h1>
          <p>Манай мэргэжлийн, туршлагатай эмч нар таны шүдний эрүүл мэндийн төлөө үйлчилнэ</p>
        </div>

        <section className="doctors-list">
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-image">
                  <Image
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    width={300}
                    height={300}
                    className="object-cover"
                  />
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
                  <Link href={`/book-online?doctor=${doctor.id}`}>
                    <button className="button">Цаг захиалах</button>
                  </Link>
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

