import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { servicesAPI } from "@/lib/api"
import "./service.css"

export default async function ServicesPage() {
  // Fetch services from API
  const response = await servicesAPI.getAll()
  const services = response.success ? response.services : []
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

