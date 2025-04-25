import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for doctors
    const doctors = [
      {
        id: "1",
        name: "Д. Болормаа",
        position: "Ерөнхий шүдний эмч",
        experience: "15 жилийн туршлагатай",
        education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
        specialization: "Шүдний ломбо, цэвэрлэгээ, яаралтай тусламж",
        image: "/images/doctor-1.jpg",
      },
      {
        id: "2",
        name: "Б. Батбаяр",
        position: "Шүдний мэс засалч",
        experience: "12 жилийн туршлагатай",
        education: "АШУҮИС, Шүдний мэс заслын тэнхим",
        specialization: "Шүдний мэс засал, имплант, эрүүний гажиг",
        image: "/images/doctor-2.jpg",
      },
      {
        id: "3",
        name: "Г. Оюунчимэг",
        position: "Шүдний гажиг засалч",
        experience: "10 жилийн туршлагатай",
        education: "АШУҮИС, Шүдний гажиг заслын тэнхим",
        specialization: "Шүдний гажиг засал, хүүхдийн шүдний эмчилгээ",
        image: "/images/doctor-3.jpg",
      },
      {
        id: "4",
        name: "Н. Энхбаяр",
        position: "Шүдний эмч",
        experience: "8 жилийн туршлагатай",
        education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
        specialization: "Шүдний цайралт, гоо сайхны шүдний эмчилгээ",
        image: "/images/doctor-4.jpg",
      },
      {
        id: "5",
        name: "С. Мөнхзул",
        position: "Хүүхдийн шүдний эмч",
        experience: "7 жилийн туршлагатай",
        education: "АШУҮИС, Хүүхдийн шүдний эмчилгээний тэнхим",
        specialization: "Хүүхдийн шүдний эмчилгээ, урьдчилан сэргийлэх эмчилгээ",
        image: "/images/doctor-5.jpg",
      },
      {
        id: "6",
        name: "Д. Ганбаатар",
        position: "Шүдний эмч",
        experience: "9 жилийн туршлагатай",
        education: "АШУҮИС, Шүдний эмчилгээний тэнхим",
        specialization: "Шүдний суулгац, титэм, гүүр",
        image: "/images/doctor-6.jpg",
      },
    ]

    return NextResponse.json({ success: true, doctors })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
