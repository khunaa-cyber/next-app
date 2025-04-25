import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Check if required fields are provided
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email and password are required" }, { status: 400 })
    }

    // In a real app, you would check if the user already exists
    // and hash the password before storing it

    // Mock user creation
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: "client",
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
