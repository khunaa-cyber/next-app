"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./service.css"
import ServiceSlider from "@/components/service-slider"
import { useState } from "react"

export default function ServicesPage() {
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null)

  const services = [
    {
      id: 1,
      title: "Шүдний цэвэрлэгээ",
      description: "Мэргэжлийн шүдний эмч нар таны шүдийг гүнзгий цэвэрлэж, өнгөлж, эрүүл байлгахад тусална.",
      images: ["/s-c1.jpg","/s-c2.jpg","/s-c3.jpg","/s-c4.jpg"],
      price: "50,000₮-с эхэлнэ",
    },
    {
      id: 2,
      title: "Шүдний ломбо",
      description: "Орчин үеийн материал ашиглан шүдний цоорлыг засаж, шүдний анхны хэлбэр, үүргийг сэргээнэ.",
      images: ["/s-f1.jpg", "/s-f2.jpg", "/s-f3.jpg", "/s-f4.jpg"],
      price: "80,000₮-с эхэлнэ",
    },
    {
      id: 3,
      title: "Шүдний суулгац",
      description: "Алдагдсан шүдийг орлуулах хамгийн дэвшилтэт арга бөгөөд шүдний үндэс хүртэл сэргээнэ.",
      images: ["/s-i1.jpg", "/s-i2.jpg", "/s-i3.jpg", "/s-i4.jpg"],
      price: "1,500,000₮-с эхэлнэ",
    },
    {
      id: 4,
      title: "Шүдний гажиг засал",
      description: "Шүдний эгнээг засах, зөв байрлуулах эмчилгээ хийнэ.",
      images: ["/s-b1.jpg", "/s-b2.jpg", "/s-b3.jpg", "/s-b4.jpg"],
      price: "2,000,000₮-с эхэлнэ",
    },
    {
      id: 5,
      title: "Шүдний цайруулалт",
      description: "Мэргэжлийн аргаар шүдийг цайруулж, инээмсэглэлийг тань илүү гэрэлтүүлнэ.",
      images: ["/s-w1.jpg", "/s-w2.jpg", "/s-w3.jpg", "/s-w4.jpg"],
      price: "250,000₮-с эхэлнэ",
    },
    {
      id: 6,
      title: "Хүүхдийн шүдний эмчилгээ",
      description: "Хүүхдийн шүдний онцлогт тохирсон эмчилгээг хийж, эрүүл зуршил төлөвшүүлэхэд тусална.",
      images: ["/s-p1.jpg", "/s-p2.jpg", "/s-p3.jpg", "/s-p4.jpg"],
      price: "40,000₮-с эхэлнэ",
    },
    {
      id: 7,
      title: "Яаралтай тусламж",
      description: "Шүдний өвдөлт, гэмтэл зэрэг яаралтай тохиолдолд хурдан шуурхай тусламж үзүүлнэ.",
      images: ["/s-e1.jpg", "/s-e2.jpg"],
      price: "100,000₮-с эхэлнэ",
    },
    {
      id: 8,
      title: "Шүдний титэм, гүүр",
      description: "Эвдэрсэн, гэмтсэн шүдийг сэргээх, алдагдсан шүдийг орлуулах шийдэл.",
      images: ["/s-cr1.jpg", "/s-cr2.jpg", "/s-cr3.jpg", "/s-cr4.jpg"],
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
                {service.images ? (
                  <ServiceSlider title={service.title} images={service.images} />
                ) : (
                  <Image
                    src={service.images || "/placeholder.svg"}
                    alt={service.title}
                    width={400}
                    height={250}
                  />
                )}
                </div>
                <div className="service-details">
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <div className="service-price">
                    <span>{service.price}</span>
                  </div>
                  <button
                    className="button"
                    onClick={() =>
                      setExpandedServiceId(expandedServiceId === service.id ? null : service.id)
                    }
                  >
                    {expandedServiceId === service.id ? "Хураах" : "Дэлгэрэнгүй"}
                  </button>
                </div>
                {expandedServiceId === service.id && (
                  <div className="service-expanded">
                    <p>Энд дэлгэрэнгүй мэдээлэл байна.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="service-cta">
          <div className="cta-content">
            <h2>Эрүүл шүд, гэрэлтсэн инээмсэглэлтэй болохыг хүсч байна уу?</h2>
            <p>Манай мэргэжлийн баг танд туслахад бэлэн байна</p>
            <Link href="/book-online">
              <button className="button">Цаг захиалах</button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

