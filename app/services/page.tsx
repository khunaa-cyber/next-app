import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./service.css"

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Шүдний цэвэрлэгээ",
      description: "Мэргэжлийн шүдний эмч нар таны шүдийг гүнзгий цэвэрлэж, өнгөлж, эрүүл байлгахад тусална.",
      image: "/images/service-cleaning.jpg",
      price: "50,000₮-с эхэлнэ",
    },
    {
      id: 2,
      title: "Шүдний ломбо",
      description: "Орчин үеийн материал ашиглан шүдний цоорлыг засаж, шүдний анхны хэлбэр, үүргийг сэргээнэ.",
      image: "/images/service-filling.jpg",
      price: "80,000₮-с эхэлнэ",
    },
    {
      id: 3,
      title: "Шүдний суулгац",
      description: "Алдагдсан шүдийг орлуулах хамгийн дэвшилтэт арга бөгөөд шүдний үндэс хүртэл сэргээнэ.",
      image: "/images/service-implant.jpg",
      price: "1,500,000₮-с эхэлнэ",
    },
    {
      id: 4,
      title: "Шүдний гажиг засал",
      description: "Шүдний эгнээг засах, зөв байрлуулах эмчилгээ хийнэ.",
      image: "/images/service-braces.jpg",
      price: "2,000,000₮-с эхэлнэ",
    },
    {
      id: 5,
      title: "Шүдний цайралт",
      description: "Мэргэжлийн аргаар шүдийг цайруулж, инээмсэглэлийг тань илүү гэрэлтүүлнэ.",
      image: "/images/service-whitening.jpg",
      price: "250,000₮-с эхэлнэ",
    },
    {
      id: 6,
      title: "Хүүхдийн шүдний эмчилгээ",
      description: "Хүүхдийн шүдний онцлогт тохирсон эмчилгээг хийж, эрүүл зуршил төлөвшүүлэхэд тусална.",
      image: "/images/service-pediatric.jpg",
      price: "40,000₮-с эхэлнэ",
    },
    {
      id: 7,
      title: "Яаралтай тусламж",
      description: "Шүдний өвдөлт, гэмтэл зэрэг яаралтай тохиолдолд хурдан шуурхай тусламж үзүүлнэ.",
      image: "/images/service-emergency.jpg",
      price: "100,000₮-с эхэлнэ",
    },
    {
      id: 8,
      title: "Шүдний титэм, гүүр",
      description: "Эвдэрсэн, гэмтсэн шүдийг сэргээх, алдагдсан шүдийг орлуулах шийдэл.",
      image: "/images/service-crown.jpg",
      price: "300,000₮-с эхэлнэ",
    },
  ]

  return (
    <>
      <Header />
      <main className="services-page">
        <div className="page-banner">
          <h1>Үйлчилгээнүүд</h1>
          <p>Бид таны шүдний эрүүл мэндийн бүх хэрэгцээг хангах иж бүрэн үйлчилгээг санал болгож байна</p>
        </div>

        <section className="services-list">
          <div className="services-grid">
            {services.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="service-image">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={400}
                    height={250}
                    className="object-cover"
                  />
                </div>
                <div className="service-details">
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <div className="service-price">
                    <span>{service.price}</span>
                  </div>
                  <Link href={`/book-online?service=${service.id}`}>
                    <button className="button">Цаг захиалах</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="service-cta">
          <div className="cta-content">
            <h2>Эрүүл шүд, гэрэлтсэн инээмсэглэлтэй болохыг хүсч байна уу?</h2>
            <p>Манай мэргэжлийн баг танд туслахад бэлэн байна</p>
            <Link href="/book-online">
              <button className="button">Одоо цаг захиалах</button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

