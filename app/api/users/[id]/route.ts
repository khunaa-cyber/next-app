import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 })
    }

    const user = await User.findById(id).select("-password -resetToken -resetTokenExpiry")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error(`Error fetching user with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 })
    }

    if (body.password) {
      const salt = await bcrypt.genSalt(10)
      body.password = await bcrypt.hash(body.password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).select("-password -resetToken -resetTokenExpiry")

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "User profile updated successfully",
    })
  } catch (error) {
    console.error(`Error updating user with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}