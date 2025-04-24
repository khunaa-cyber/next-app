"use client"

import { useState, useEffect } from "react"
import { faqAPI } from "@/lib/api"

export function FAQContent() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [faqItems, setFaqItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await faqAPI.getAll()
        if (response.success) {
          setFaqItems(response.faqItems)
        }
      } catch (error) {
        console.error("Error fetching FAQ:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQ()
  }, [])

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  if (isLoading) {
    return (
      <section className="faq-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Уншиж байна...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div key={index} className={`faq-item ${activeIndex === index ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleAccordion(index)}>
                <h3>{item.question}</h3>
                <span className="faq-icon">{activeIndex === index ? "-" : "+"}</span>
              </div>
              <div className={`faq-answer ${activeIndex === index ? "open" : ""}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
