import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // hereglegchiig emailer haih
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Password reset instructions have been sent to your email if it exists in our system",
      })
    }

    // nuuts ug shinechleh token uusgeh
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = Date.now() + 3600000 // 1 tsag

    // tokenig hereglegchiin medeeleld hadgalah
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // email ilgeeh code end bn
    // jishee: await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json({
      success: true,
      message: "Password reset instructions have been sent to your email",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}