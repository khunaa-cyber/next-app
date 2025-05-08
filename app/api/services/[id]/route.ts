import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Service from "@/models/Service"
import mongoose from "mongoose"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid service ID" }, { status: 400 })
    }

    const service = await Service.findById(id)

    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error(`Error fetching service with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid service ID" }, { status: 400 })
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!updatedService) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      service: updatedService,
      message: "Service updated successfully",
    })
  } catch (error) {
    console.error(`Error updating service with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid service ID" }, { status: 400 })
    }

    const deletedService = await Service.findByIdAndDelete(id)

    if (!deletedService) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    })
  } catch (error) {
    console.error(`Error deleting service with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}