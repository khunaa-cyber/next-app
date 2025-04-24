import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const appointments = [
      {
        id: 1,
        userId: "1",
        date: "2023-11-15",
        time: "10:00",
        doctorId: "1",
        doctorName: "Д. Болормаа",
        service: "Шүдний цэвэрлэгээ",
        status: "Дууссан",
        cost: "50,000₮",
        notes: "Дараагийн 6 сарын дараа шүдний цэвэрлэгээ хийлгэхийг зөвлөсөн",
        diagnosis: "Шүдний өнгөлгөө хийгдсэн",
      },
      {
        id: 2,
        userId: "1",
        date: "2023-12-20",
        time: "14:30",
        doctorId: "2",
        doctorName: "Б. Батбаяр",
        service: "Шүдний ломбо",
        status: "Дууссан",
        cost: "85,000₮",
        notes: "Хатуу хоол идэхээс зайлсхийх",
        diagnosis: "36-р шүдний цоорол",
      },
      
    ]

    const appointment = appointments.find((a) => a.id === id)

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
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { status } = body



    return NextResponse.json({
      success: true,
      message: `Appointment ${id} status updated to ${status}`,
    })
  } catch (error) {
    console.error(`Error updating appointment with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

   

    return NextResponse.json({
      success: true,
      message: `Appointment ${id} cancelled successfully`,
    })
  } catch (error) {
    console.error(`Error cancelling appointment with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
