import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctorId = params.id

    // Mock data for reviews
    const allReviews = [
      {
        id: 1,
        doctorId: "1",
        userId: "client1",
        userName: "Б. Баясгалан",
        rating: 5,
        comment: "Маш сайн эмч. Тайван, найрсаг хандлагатай, мэргэжлийн өндөр ур чадвартай.",
        date: "2023-12-15",
      },
      {
        id: 2,
        doctorId: "1",
        userId: "client2",
        userName: "Д. Сарангэрэл",
        rating: 4,
        comment: "Эмчилгээ сайн хийсэн. Цаг баримтлалт сайтай.",
        date: "2024-01-20",
      },
      {
        id: 3,
        doctorId: "2",
        userId: "client3",
        userName: "Г. Батболд",
        rating: 5,
        comment: "Хүүхдийн шүдийг маш сайн эмчилсэн. Хүүхэдтэй маш сайн харьцдаг.",
        date: "2024-02-10",
      },
      {
        id: 4,
        doctorId: "3",
        userId: "client4",
        userName: "С. Оюунтуяа",
        rating: 4,
        comment: "Шүдний гажиг засал маш сайн хийсэн. Үр дүн нь харагдаж байна.",
        date: "2024-03-05",
      },
    ]

    // Filter reviews for the specified doctor
    const doctorReviews = allReviews.filter((review) => review.doctorId === doctorId)

    return NextResponse.json({ success: true, reviews: doctorReviews })
  } catch (error) {
    console.error(`Error fetching reviews for doctor with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctorId = params.id
    const body = await request.json()
    const { userId, userName, rating, comment } = body

    // Validate required fields
    if (!userId || !userName || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "User ID, name, rating, and comment are required" },
        { status: 400 },
      )
    }

    // In a real app, you would save this to a database
    const newReview = {
      id: Date.now(),
      doctorId,
      userId,
      userName,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    }

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Review submitted successfully",
    })
  } catch (error) {
    console.error(`Error submitting review for doctor with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
