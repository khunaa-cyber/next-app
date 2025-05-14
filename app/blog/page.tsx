"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./blog.css"

interface NewsItem {
  _id: string
  title: string
  content: string
  description: string
  image: string
  date: string
  category: string
}

interface CategoryNames {
  [key: string]: string
  all: string
  general: string
  "dental-health": string
  technology: string
  events: string
  promotions: string
}

export default function BlogPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/news")
        const data = await response.json()

        if (data.success) {
          setNews(data.news)
        } else {
          setError(data.message || "Мэдээ ачааллахад алдаа гарлаа")
        }
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Мэдээ ачааллахад алдаа гарлаа")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Filter news by category
  const filteredNews = activeCategory === "all" ? news : news.filter((item) => item.category === activeCategory)

  // Map category codes to readable names
  const categoryNames: CategoryNames = {
    all: "Бүгд",
    general: "Ерөнхий",
    "dental-health": "Шүдний эрүүл мэнд",
    technology: "Технологи",
    events: "Үйл явдал",
    promotions: "Урамшуулал",
  }

  // Get unique categories from news
  const categories = ["all", ...new Set(news.map((item) => item.category))]

  const toggleExpand = (newsId: string) => {
    setExpandedNewsId(expandedNewsId === newsId ? null : newsId)
  }

  return (
    <>
      <Header />
      <main className="blog-page">
        <div className="page-banner">
          <h1>Мэдээ мэдээлэл</h1>
          <p>Шүдний эрүүл мэндийн талаарх мэдээ, мэдээлэл</p>
        </div>

        <section className="blog-list">
          <div className="blog-filters">
            {categories.map((category: string) => (
              <button
                key={category}
                className={`filter-button ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {categoryNames[category] || category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Уншиж байна...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredNews.length > 0 ? (
            <div className="blog-grid">
              {filteredNews.map((item: NewsItem) => (
                <div className="blog-card" key={item._id}>
                  <div className="blog-image">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="blog-details">
                    <div className="blog-meta">
                      <span className="blog-date">{new Date(item.date).toLocaleDateString("mn-MN")}</span>
                      <span className="blog-category">{categoryNames[item.category] || item.category}</span>
                    </div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <button className="button" onClick={() => toggleExpand(item._id)}>
                      {expandedNewsId === item._id ? "Хураах" : "Дэлгэрэнгүй"}
                    </button>

                    {expandedNewsId === item._id && (
                      <div className="blog-expanded">
                        <div className="blog-full-content">
                          {item.content.split("\n").map((paragraph: string, index: number) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                        <div className="blog-expanded-meta">
                          <p className="blog-expanded-date">
                            <strong>Огноо:</strong>{" "}
                            {new Date(item.date).toLocaleDateString("mn-MN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="blog-expanded-category">
                            <strong>Ангилал:</strong> {categoryNames[item.category] || item.category}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <p>Энэ ангилалд мэдээ байхгүй байна.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
