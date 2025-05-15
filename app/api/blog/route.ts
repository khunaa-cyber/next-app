// app/api/blog/route.ts
import clientPromise from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// --- Мэдээлэл авах (GET) ---
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const blogCollection = db.collection('blogs')

    const blogs = await blogCollection.find({}).toArray()
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// --- Мэдээлэл нэмэх (POST) ---
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, imageUrl } = body

    const client = await clientPromise
    const db = client.db()
    const blogCollection = db.collection('blogs')

    const result = await blogCollection.insertOne({
      title,
      content,
      imageUrl,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
