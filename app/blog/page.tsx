"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./blog.css"
import {newsAPI } from "@/lib/api"
import { useState, useEffect, useCallback } from "react"
import { ApiResponse } from '../api/news/route';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]); // Initialize with an empty array
  const [expandedNewsId, setExpandedNewsId] = useState<number | null>(null);

  // Fetch news data from the API
  const fetchNews = useCallback(async () => {
    try {
      const response : unknown = await newsAPI.getAll(); // Replace with your actual API method
      const data = response as ApiResponse;

      if (data.success && data.news) {
        setNews(data.news); // Update the news state
      } else {
        console.error("Failed to fetch news:", data.message);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }, []);

  useEffect(() => {
    fetchNews(); // Fetch news on component mount
  }, [fetchNews]);

  return (
    <>
      <Header />
      <main className="blog-page">
        <div className="page-banner">
          <h1>Мэдээ мэдээлэл</h1>
          <p>Шүдний эрүүл мэнд, шинэ технологи, зөвлөгөө</p>
        </div>

        <section className="blog-list">
          <div className="blog-grid">
            {news.map((post) => ( // Use the news state to render posts
              <div className="blog-card" key={post.id}>
                <div className="blog-image">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="object-cover"
                  />
                </div>
                <div className="blog-details">
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-category">{post.category}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <div className="blog-author">
                    <span>Зохиогч: {post.author}</span>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <button className="button">Дэлгэрэнгүй</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}