import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Service from "@/models/Service"

export interface ApiResponse {
  success: boolean
  services?: any[]
  message?: string
}

export async function GET() {
  try {
    await connectToDatabase()

    const services = await Service.find({}).sort({ title: 1 })

    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    if (!body.title || !body.description || !body.price) {
      return NextResponse.json(
        { success: false, message: "Title, description, and price are required" },
        { status: 400 },
      )
    }

    const newService = new Service(body)
    await newService.save()

    return NextResponse.json({
      success: true,
      service: newService,
      message: "Service created successfully",
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}