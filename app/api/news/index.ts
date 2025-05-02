import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import News from "@/models/News"

export async function GET() {
  await dbConnect()

  const news = await News.find({})
  return NextResponse.json(news)
}