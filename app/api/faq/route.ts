import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import FAQ from "@/models/FAQ"

export async function GET() {
  try {
    await connectToDatabase()

    // db-es faq avah
    const faqItems = await FAQ.find({}).sort({ order: 1 })

    return NextResponse.json({ success: true, faqItems })
  } catch (error) {
    console.error("Error fetching FAQ items:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { question, answer, order } = body

    // shaardlagatai talbaruudiig shalgah
    if (!question || !answer) {
      return NextResponse.json({ success: false, message: "Question and answer are required" }, { status: 400 })
    }

    // new faq uusgeh
    const newFAQ = new FAQ({
      question,
      answer,
      order: order || 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    await newFAQ.save()

    return NextResponse.json({
      success: true,
      faqItem: newFAQ,
      message: "FAQ item created successfully",
    })
  } catch (error) {
    console.error("Error creating FAQ item:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}