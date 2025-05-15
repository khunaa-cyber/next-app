import { MongoClient, ObjectId } from "mongodb"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import './id.css';

type BlogPost = {
  _id: string
  title: string
  content: string
  image: string
  date?: string
  author?: string
  category?: string
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dental_clinic"
    const client = await MongoClient.connect(uri)
    const db = client.db("dental_clinic")
    const post = await db.collection("blogs").findOne({ _id: new ObjectId(id) })
    await client.close()

    if (!post) return null

    return {
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      image: post.image || "/placeholder.svg",
      date: post.date || "",
      author: post.author || "Тодорхойгүй",
      category: post.category || "Ерөнхий"
    }
  } catch (error) {
    console.error("❌ getBlogPost error:", error)
    return null
  }
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await getBlogPost(params.id)

  if (!blog) {
    return notFound()
  }

  return (
    <>
      <Header />
      <main className="blog-detail-page">
        <div className="page-banner">
          <h1>{blog.title}</h1>
          <p>{blog.category} • {blog.date}</p>
        </div>

        <div className="blog-detail-content">
          <div className="blog-image-wrapper">
            <Image src={blog.image} alt={blog.title} width={400} height={300} />
            <p className="blog-author">Зохиогч: {blog.author}</p>
          </div>
          <div className="blog-text-wrapper">
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
