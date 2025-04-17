import Image from "next/image"
import { TestimonialSlider } from "@/components/testimonial-slider"
import { FacilitySlider } from "@/components/facility-slider"
import { StatsSection } from "@/components/stats-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { LocationsSection } from "@/components/locations-section"
import { ContactSection } from "@/components/contact-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="home-page">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <h1>
            Шүд эрүүл бол <br />
            бие эрүүл
          </h1>
          <p>
            Таны инээмсэглэлийн төлөө <br />
            Манай туршлагатай, найдвартай үйлчилгээ!
          </p>
        </div>
        <div className="hero-image">
          <Image src="/home.jpeg" alt="Dental clinic hero image" fill priority className="object-cover" />
        </div>zz
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-title">
          <span className="divider">|</span>
          <p>Үйлчлүүлэгчдийн сэтгэгдэлүүдээс</p>
          <span className="divider">|</span>
        </div>
        <TestimonialSlider />
      </section>

      {/* Facility Section */}
      <section className="facility-section">
        <div className="facility-title">
          <i className="fa-solid fa-location-dot"></i>
          <h2>Тав тухтай, тохилог орчин</h2>
        </div>
        <FacilitySlider />
      </section>

      {/* Locations Section */}
      <LocationsSection />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </main>
  )
}

