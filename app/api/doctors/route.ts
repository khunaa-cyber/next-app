import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Doctor from "@/models/Doctor"
import { boolean } from "drizzle-orm/gel-core"
 
export interface ApiResponse {
  success: boolean
  doctors?: any[]
  message?: string
}


export async function GET() {
  try {
    await connectToDatabase()

    // db-es emch nariin medeelel avah
    const doctors = await Doctor.find({}).sort({ name: 1 })

    return NextResponse.json({ success: true, doctors })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    // new emch uusgeh
    const newDoctor = new Doctor(body)
    await newDoctor.save()

    return NextResponse.json({
      success: true,
      doctor: newDoctor,
      message: "Doctor created successfully",
    })
  } catch (error) {
    console.error("Error creating doctor:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}