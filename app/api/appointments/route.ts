import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import User from "@/models/User"
import Doctor from "@/models/Doctor"
import mongoose from "mongoose"

export async function GET(request: Request) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const doctorId = searchParams.get("doctorId")
    const date = searchParams.get("date")

    // hailt uusgeh
    const filter: any = {}
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.userId = userId
    }
    if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
      filter.doctorId = doctorId
    }
    if (date) {
      filter.date = date
    }

    // db-es tsag zahialguud avah
    const appointments = await Appointment.find(filter)
      .populate("userId", "name email phone")
      .populate("doctorId", "name position")
      .sort({ date: -1, time: 1 })

    return NextResponse.json({ success: true, appointments })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { userId, doctorId, date, time, service, phone = "", notes = "" } = body

    if (!userId || !doctorId || !date || !time || !service) {
      return NextResponse.json(
        { success: false, message: "User ID, doctor ID, date, time, and service are required" },
        { status: 400 },
      )
    }

    // ID huchintei esehiig shalgah
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID or doctor ID" }, { status: 400 })
    }

    // herglegch bolon emch baigaa eshiig shalgah
    const user = await User.findById(userId)
    const doctor = await Doctor.findById(doctorId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    // tsag zahialga davhardsan eshiig shalgah
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "Цуцалсан" }, // tsutslagdagu tsag zahialgiig shalgah
    })

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, message: "Энэ цаг аль хэдийн захиалагдсан байна. Өөр цаг сонгоно уу." },
        { status: 400 },
      )
    }

    // shine tsag zahialga uusgeh
    const newAppointment = new Appointment({
      userId,
      doctorId,
      date,
      time,
      service,
      phone,
      notes,
      status: "Хүлээгдэж буй",
    })

    await newAppointment.save()

    return NextResponse.json({
      success: true,
      appointment: newAppointment,
      message: "Appointment created successfully",
    })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}