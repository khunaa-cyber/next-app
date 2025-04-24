import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Mock authentication logic
    // In a real app, you would validate against a database
    const mockUsers = [
      { id: "1", name: "Client User", email: "client@example.com", password: "password", role: "client" },
      { id: "2", name: "Doctor User", email: "doctor@example.com", password: "password", role: "doctor" },
      { id: "3", name: "Admin User", email: "admin@example.com", password: "password", role: "admin" },
    ]

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
