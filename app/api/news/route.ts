import {NextResponse} from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import News from '@/models/News';


export async function GET() {
  try {
    await connectToDatabase()

    const news = await News.find({}).sort({ date: -1 })

    return NextResponse.json({ success: true, news })
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { title, content, date, image, description, category } = body

    // shaardlagatai talbaruudiig shalgah
    if (!title || !content || !description || !category) {
      return NextResponse.json(
        { success: false, message: "Name, email, subject, message, and feedback type are required" },
        { status: 400 },
      )
    }

    // shine sanal huselt uusgeh
    const newNews = new News({
      title,
      content,
      date: date || new Date(),
      image: image || "",
    })

    await newNews.save()

    return NextResponse.json({
      success: true,
      news: newNews,
      message: "Feedback submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
} 