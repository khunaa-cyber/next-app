import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Doctor from "@/models/Doctor"
import mongoose from "mongoose"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    // ID huchintei esehiig shalgah
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 })
    }

    // db-es emhciin id-gar medeelel avah
    const doctor = await Doctor.findById(id)

    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, doctor })
  } catch (error) {
    console.error(`Error fetching doctor with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id
    const body = await request.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 })
    }

    // emchiin medeelliig shinechleh
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!updatedDoctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      doctor: updatedDoctor,
      message: "Doctor updated successfully",
    })
  } catch (error) {
    console.error(`Error updating doctor with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 })
    }

    // emchiig ustgah
    const deletedDoctor = await Doctor.findByIdAndDelete(id)

    if (!deletedDoctor) {
      return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Doctor deleted successfully",
    })
  } catch (error) {
    console.error(`Error deleting doctor with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
