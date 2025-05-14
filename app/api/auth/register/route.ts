import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectToDatabase()
    console.log("MongoDB connected for registration")

    const body = await request.json()
    const { name, email, password, role = "client" } = body
    console.log(`Registration attempt for: ${name} (${email}) with role: ${role}`)

    // Validate input
    if (!name || !email || !password) {
      console.log("Registration failed: Missing required fields")
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["client", "doctor", "admin"]
    if (!validRoles.includes(role)) {
      console.log(`Registration failed: Invalid role: ${role}`)
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log(`Registration failed: User with email ${email} already exists`)
      return NextResponse.json({ success: false, message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log("Password hashed successfully")

    // Create new user with the specified role
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      // If registering as a doctor, set status to pending
      status: role === "doctor" ? "pending" : "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Save user to database
    const savedUser = await newUser.save()
    console.log(`User registered successfully: ${name} (ID: ${savedUser._id}) with role: ${role}`)

    // Convert user document to plain object
    const userObj = savedUser.toObject ? savedUser.toObject() : savedUser

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = userObj

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        id: userWithoutPassword._id.toString(), // Ensure ID is a string
      },
      message: "User registered successfully",
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