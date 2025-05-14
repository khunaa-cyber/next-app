import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import News from "@/models/News"
import mongoose from "mongoose"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid news ID" }, { status: 400 })
    }

    const news = await News.findById(id)

    if (!news) {
      return NextResponse.json({ success: false, message: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, news })
  } catch (error) {
    console.error(`Error fetching news with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid news ID" }, { status: 400 })
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!updatedNews) {
      return NextResponse.json({ success: false, message: "News not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      news: updatedNews,
      message: "News updated successfully",
    })
  } catch (error) {
    console.error(`Error updating news with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid news ID" }, { status: 400 })
    }

    const deletedNews = await News.findByIdAndDelete(id)

    if (!deletedNews) {
      return NextResponse.json({ success: false, message: "News not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "News deleted successfully",
    })
  } catch (error) {
    console.error(`Error deleting news with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
