"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "../blog.css";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

interface CategoryNames {
  [key: string]: string;
  general: string;
  "dental-health": string;
  technology: string;
  events: string;
  promotions: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/news/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setNews(data.news);

          // Fetch related news
          const relatedResponse = await fetch("/api/news");
          const relatedData = await response.json();

          if (relatedData.success) {
            // Filter out current news and limit to 3 related news
            const filtered = relatedData.news
              .filter((item: NewsItem) => item._id !== params.id)
              .filter((item: NewsItem) => item.category === data.news.category)
              .slice(0, 3);

            setRelatedNews(filtered);
          }
        } else {
          setError(data.message || "Мэдээ олдсонгүй");
        }
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError("Мэдээ ачааллахад алдаа гарлаа");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchNewsDetail();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="blog-detail-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Уншиж байна...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <Header />
        <main className="blog-detail-page">
          <div className="page-banner">
            <h1>Алдаа</h1>
            <p>{error || "Мэдээ олдсонгүй"}</p>
          </div>
          <div className="blog-detail-container">
            <Link href="/blog">
              <button className="button">Бүх мэдээ рүү буцах</button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Format the date
  const formattedDate = new Date(news.date).toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Map category codes to readable names
  const categoryNames: CategoryNames = {
    general: "Ерөнхий",
    "dental-health": "Шүдний эрүүл мэнд",
    technology: "Технологи",
    events: "Үйл явдал",
    promotions: "Урамшуулал",
  };

  return (
    <>
      <Header />
      <main className="blog-detail-page">
        <div className="page-banner">
          <h1>Мэдээ мэдээлэл</h1>
          <p>Шүдний эрүүл мэндийн талаарх мэдээ, мэдээлэл</p>
        </div>

        <div className="blog-detail-container">
          <div className="blog-detail-header">
            <h1>{news.title}</h1>
            <div className="blog-detail-meta">
              <span>{formattedDate}</span>
              <span>{categoryNames[news.category] || news.category}</span>
            </div>
          </div>

          <div className="blog-detail-image">
            <Image
              src={news.image || "/placeholder.svg"}
              alt={news.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="blog-detail-content">
            {news.content
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>

          {relatedNews.length > 0 && (
            <div className="blog-related">
              <h2>Холбоотой мэдээ</h2>
              <div className="blog-grid">
                {relatedNews.map((item: NewsItem) => (
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
                        <span className="blog-date">
                          {new Date(item.date).toLocaleDateString("mn-MN")}
                        </span>
                        <span className="blog-category">
                          {categoryNames[item.category] || item.category}
                        </span>
                      </div>
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                      <Link href={`/blog/${item._id}`}>
                        <button className="button">Дэлгэрэнгүй</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "3rem" }}>
            <Link href="/blog">
              <button className="button">Бүх мэдээ рүү буцах</button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
