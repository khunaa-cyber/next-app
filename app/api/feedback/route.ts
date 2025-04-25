import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, feedbackType } = body

    // Validate required fields
    if (!name || !email || !subject || !message || !feedbackType) {
      return NextResponse.json(
        { success: false, message: "Name, email, subject, message, and feedback type are required" },
        { status: 400 },
      )
    }

    // In a real app, you would save this to a database
    const newFeedback = {
      id: Date.now(),
      name,
      email,
      phone: phone || "",
      subject,
      message,
      feedbackType,
      date: new Date().toISOString(),
    }

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
