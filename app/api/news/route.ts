import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import News from "@/models/News"

export async function GET() {
  try {
    await connectToDatabase()

    const news = await News.find({}).sort({ date: -1 })

    return NextResponse.json({ success: true, news })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { title, content, date, image, description, category } = body

    // Check required fields
    if (!title || !content || !description || !image) {
      return NextResponse.json(
        { success: false, message: "Title, content, description, and image are required" },
        { status: 400 },
      )
    }

    // Create new news item
    const newNews = new News({
      title,
      content,
      date: date || new Date(),
      image,
      description,
      category: category || "general",
    })

    await newNews.save()

    return NextResponse.json({
      success: true,
      news: newNews,
      message: "News added successfully",
    })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
