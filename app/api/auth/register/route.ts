import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { name, email, password } = body

    // shaardlagatai talbaruudiig shalgah
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email and password are required" }, { status: 400 })
    }

    // email haygiin burtgel shalgah
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email is already registered" }, { status: 400 })
    }

    // nuuts ugiig avah
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // shine hereglegch uusgeh
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "client", // uusgesen herglegch client erhtei bn
    })

    await newUser.save()

    const userWithoutPassword = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
