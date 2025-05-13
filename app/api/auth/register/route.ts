import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  console.log("Registration API called")

  try {
    // Connect to MongoDB first
    console.log("Connecting to MongoDB...")
    await connectToDatabase()
    console.log("MongoDB connected successfully")

    // Parse request body
    const body = await request.json()
    const { name, email, password } = body
    console.log('Registration attempt for: ${name} (${email})')

    // Validate required fields
    if (!name || !email || !password) {
      console.log("Registration failed: Missing required fields")
      return NextResponse.json({ success: false, message: "Name, email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    console.log('Checking if user with email ${email} already exists...')
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      console.log('Registration failed: User with email ${email} already exists')
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }

    // Hash password
    console.log("Hashing password...")
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    console.log("Creating new user in database...")
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "client",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Save user to database
    await newUser.save()
    console.log('User saved to database with ID: ${newUser._id}')

    // Don't send password back to client
    const userResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }

    console.log("Registration successful, returning user data")
    return NextResponse.json({
      success: true,
      user: userResponse,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during registration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}