import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Review from "@/models/Review"
import Doctor from "@/models/Doctor"
import mongoose from "mongoose"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const doctorId = params.id

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 })
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    const reviews = await Review.find({ doctorId }).populate("userId", "name email")

    return NextResponse.json({ success: true, reviews })
  } catch (error) {
    console.error(`Error fetching reviews for doctor with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const doctorId = params.id
    const body = await request.json()
    const { userId, userName, rating, comment } = body

    if (!userId || !userName || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "User ID, name, rating, and comment are required" },
        { status: 400 },
      )
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 })
    }

    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    const newReview = new Review({
      doctorId,
      userId,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    })

    await newReview.save()

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Review submitted successfully",
    })
  } catch (error) {
    console.error(`Error submitting review for doctor with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
