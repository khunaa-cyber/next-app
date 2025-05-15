import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MongoClient } from "mongodb"
import "./blog.css"

type BlogPost = {
  _id: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  image: string
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dental_clinic"
  const client = await MongoClient.connect(uri)
  const db = client.db("dental_clinic")
  const blogs = await db.collection("blogs").find().toArray()
  await client.close()

  return blogs.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    author: post.author,
    category: post.category,
    image: post.image || "/placeholder.svg",
  }))
}

export default async function BlogPage() {
  const blogPosts = await fetchBlogPosts()

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
            {blogPosts.map((post) => (
              <div className="blog-card" key={post._id}>
                <div className="blog-image">
                  <Image
                    src={post.image}
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
                  <Link href={`/blog/${post._id}`}>
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
  )
}
