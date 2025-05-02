import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./blog.css"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Шүдээ зөв угаах арга",
      excerpt:
        "Шүдээ зөв угаах нь шүдний эрүүл мэндийг хадгалах хамгийн чухал алхам юм. Энэ нийтлэлд шүдээ зөв угаах аргыг дэлгэрэнгүй тайлбарлаж байна.",
      date: "2023-05-15",
      author: "Д. Болормаа",
      category: "Шүдний эрүүл мэнд",
      image: "/images/blog-1.jpg",
    },
    {
      id: 2,
      title: "Хүүхдийн шүдний эрүүл мэнд",
      excerpt: "Хүүхдийн шүдний эрүүл мэндийг хэрхэн хамгаалах, зөв дадал зуршил төлөвшүүлэх талаар мэдээлэл.",
      date: "2023-06-22",
      author: "С. Мөнхзул",
      category: "Хүүхдийн шүдний эмчилгээ",
      image: "/images/blog-2.jpg",
    },
    {
      id: 3,
      title: "Шүдний имплантын давуу талууд",
      excerpt:
        "Шүдний имплант нь алдагдсан шүдийг орлуулах хамгийн дэвшилтэт арга. Энэ нийтлэлд имплантын давуу талуудыг тайлбарлаж байна.",
      date: "2023-07-10",
      author: "Б. Батбаяр",
      category: "Шүдний имплант",
      image: "/images/blog-3.jpg",
    },
    {
      id: 4,
      title: "Шүдний өвчин ба ерөнхий эрүүл мэнд",
      excerpt:
        "Шүдний өвчин нь зүрх судасны өвчин, чихрийн шижин зэрэг бусад эрүүл мэндийн асуудалтай хэрхэн холбогддог талаар.",
      date: "2023-08-05",
      author: "Д. Болормаа",
      category: "Шүдний эрүүл мэнд",
      image: "/images/blog-4.jpg",
    },
    {
      id: 5,
      title: "Шүдний гажиг засал: Насанд хүрэгчдэд зориулсан",
      excerpt: "Насанд хүрэгчдэд зориулсан шүдний гажиг засал, үүний давуу талууд болон сонголтууд.",
      date: "2023-09-18",
      author: "Г. Оюунчимэг",
      category: "Шүдний гажиг засал",
      image: "/images/blog-5.jpg",
    },
    {
      id: 6,
      title: "Шүдний цайралт: Мэдэх ёстой зүйлс",
      excerpt: "Шүдний цайралтын талаар мэдэх ёстой бүх зүйл: үр дүн, аюулгүй байдал, арчилгаа.",
      date: "2023-10-30",
      author: "Н. Энхбаяр",
      category: "Шүдний гоо сайхан",
      image: "/images/blog-6.jpg",
    },
  ]

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
  )
}