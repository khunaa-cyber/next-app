import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Mock data for users
    const users = [
      {
        id: "1",
        name: "Client User",
        email: "client@example.com",
        role: "client",
        phone: "99887766",
        address: "Баянзүрх дүүрэг, 13-р хороолол",
        birthdate: "1990-01-01",
        gender: "Эрэгтэй",
        allergies: "Байхгүй",
        bloodType: "A+",
      },
      {
        id: "2",
        name: "Doctor User",
        email: "doctor@example.com",
        role: "doctor",
        phone: "99112233",
        address: "Сүхбаатар дүүрэг, 1-р хороо",
        birthdate: "1985-05-15",
        gender: "Эмэгтэй",
        specialization: "Шүдний эмч",
        experience: "10 жил",
      },
      {
        id: "3",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        phone: "99445566",
        address: "Хан-Уул дүүрэг, 2-р хороо",
        birthdate: "1982-08-20",
        gender: "Эрэгтэй",
      },
    ]

    const user = users.find((u) => u.id === id)

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
    const id = params.id
    const body = await request.json()

    // In a real app, you would update the user in the database
    // For now, we'll just return the updated user

    return NextResponse.json({
      success: true,
      user: { id, ...body },
      message: "User profile updated successfully",
    })
  } catch (error) {
    console.error(`Error updating user with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
