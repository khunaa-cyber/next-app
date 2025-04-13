import Image from "next/image"

export function ServicesSection() {
  const services = [
    {
      image: "/intro1.png",
      title: "Иж бүрэн шүдний эмчилгээ",
      description: "Бүх төрлийн шүдний эмчилгээг үзүүлнэ.",
    },
    {
      image: "/review5.JPG",
      title: "Аюулгүй орчин",
      description: "Дижитал ариутгалын системээр халдваргүйжүүлэлт хийж, эрүүл ахуйн стандартыг чанд сахина.",
    },
    {
      image: "/review2.png",
      title: "Нарийн оношилгоо",
      description: "Шинэлэг технологийн тусламжтайгаар хурдан, нарийн оношилгоо үзүүлнэ.",
    },
    {
      image: "/review4.png",
      title: "Гадаах зогсоол",
      description: "Саруулхан, том зогсоолын үйлчилгээ",
    },
    {
      image: "/review3.png",
      title: "Амрах, хүлээх танхим",
      description: "Тохилог тав тухтай хүлээх танхим, хүүхдийн буланг багтаасан.",
    },
    {
      image: "/review1.png",
      title: "Санхүүгийн зөвлөгөө, зохицуулалт",
      description:
        "Эмчилгээний зардлыг илүү ойлгомжтой болгох болон даатгалын асуудлыг шийдвэрлэхэд тань манай санхүүгийн зөвлөх тусална.",
    },
  ]

  return (
    <section className="services-section">
      <div className="section-title">
        <span className="divider">|</span>
        <h3>Бүгдийг нэг дор цогцлоосон.</h3>
        <span className="divider">|</span>
      </div>

      <div className="services-container">
        {services.map((service, index) => (
          <div className="service-box" key={index}>
            <div className="service-image">
              <Image src={service.image || "/placeholder.svg"} alt={service.title} width={300} height={200} />
            </div>
            <div className="service-content">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

