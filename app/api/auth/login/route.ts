import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase()
    console.log("MongoDB connected for login")

    const body = await request.json()
    const { email, password } = body
    console.log(`Login attempt for email: ${email}`)

    if (!email || !password) {
      console.log("Login failed: Missing email or password")
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email })
    console.log(`User found: ${user ? "Yes" : "No"}`)

    if (!user) {
      console.log(`Login failed: No user found with email ${email}`)
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Check if doctor account is pending approval
    if (user.role === "doctor" && user.status === "pending") {
      console.log(`Login failed: Doctor account ${email} is pending approval`)
      return NextResponse.json(
        {
          success: false,
          message: "Таны эмчийн бүртгэл одоогоор баталгаажаагүй байна. Баталгаажих хүртэл түр хүлээнэ үү.",
        },
        { status: 403 },
      )
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(`Password match: ${isMatch ? "Yes" : "No"}`)

    if (!isMatch) {
      console.log(`Login failed: Invalid password for ${email}`)
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Convert user document to plain object
    const userObj = user.toObject ? user.toObject() : user

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = userObj

    console.log(`Login successful for user: ${user.name} (${user._id}) with role: ${user.role}`)

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        id: userWithoutPassword._id.toString(), // Ensure ID is a string
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
