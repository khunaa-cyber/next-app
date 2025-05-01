import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Appointment from "@/models/Appointment"
import mongoose from "mongoose"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    // ID huchintei esehiig shalgah
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid appointment ID" }, { status: 400 })
    }

    // db-es medeelel avah
    const appointment = await Appointment.findById(id)
      .populate("userId", "name email phone")
      .populate("doctorId", "name position")

    if (!appointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error(`Error fetching appointment with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid appointment ID" }, { status: 400 })
    }

    // medeelliig shinechleh
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!updatedAppointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      appointment: updatedAppointment,
      message: "Appointment updated successfully",
    })
  } catch (error) {
    console.error(`Error updating appointment with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid appointment ID" }, { status: 400 })
    }

    // tsag zahialgiin statusiig oorchloh-tsutslah
    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "Цуцалсан", updatedAt: Date.now() },
      { new: true },
    )

    if (!cancelledAppointment) {
      return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully",
    })
  } catch (error) {
    console.error(`Error cancelling appointment with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
