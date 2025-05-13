"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { servicesAPI } from "@/lib/api"
import "./service.css"
import ServiceSlider from "@/components/service-slider"
import { useState, useEffect, useCallback } from "react"
import { ApiResponse } from '../api/services/route';


export default function ServicesPage() {
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null)
  const [services, setServices] = useState<any[]>([])

  const fetchServices = useCallback(async () => {
    try {
      const response: unknown = await servicesAPI.getAll();

      const data = response as ApiResponse;

      if (data.success && data.services) {
        setServices(data.services);
      } else {
        console.error("Failed to fetch services:", data.message);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

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
              <div className="service-card" key={service._id}>
                <div className="service-image">
                  {service.images ? (
                    <ServiceSlider title={service.title} images={service.images} />
                  ) : (
                    <Image
                      src={"/placeholder.svg"}
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
