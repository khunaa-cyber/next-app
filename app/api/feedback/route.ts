import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Feedback from "@/models/Feedback"

export async function GET() {
  try {
    await connectToDatabase()

    // db-es sanal huseltuud avah
    const feedbacks = await Feedback.find({}).sort({ date: -1 })

    return NextResponse.json({ success: true, feedbacks })
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, email, phone, subject, message, feedbackType } = body

    // shaardlagatai talbaruudiig shalgah
    if (!name || !email || !subject || !message || !feedbackType) {
      return NextResponse.json(
        { success: false, message: "Name, email, subject, message, and feedback type are required" },
        { status: 400 },
      )
    }

    // shine sanal huselt uusgeh
    const newFeedback = new Feedback({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      feedbackType,
      date: new Date(),
    })

    await newFeedback.save()

    return NextResponse.json({
      success: true,
      feedback: newFeedback,
      message: "Feedback submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}