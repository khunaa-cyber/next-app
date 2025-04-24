import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for services
    const services = [
      {
        id: 1,
        title: "Шүдний цэвэрлэгээ",
        description: "Мэргэжлийн шүдний эмч нар таны шүдийг гүнзгий цэвэрлэж, өнгөлж, эрүүл байлгахад тусална.",
        image: "/images/service-cleaning.jpg",
        price: "50,000₮-с эхэлнэ",
      },
      {
        id: 2,
        title: "Шүдний ломбо",
        description: "Орчин үеийн материал ашиглан шүдний цоорлыг засаж, шүдний анхны хэлбэр, үүргийг сэргээнэ.",
        image: "/images/service-filling.jpg",
        price: "80,000₮-с эхэлнэ",
      },
      {
        id: 3,
        title: "Шүдний суулгац",
        description: "Алдагдсан шүдийг орлуулах хамгийн дэвшилтэт арга бөгөөд шүдний үндэс хүртэл сэргээнэ.",
        image: "/images/service-implant.jpg",
        price: "1,500,000₮-с эхэлнэ",
      },
      {
        id: 4,
        title: "Шүдний гажиг засал",
        description: "Шүдний эгнээг засах, зөв байрлуулах эмчилгээ хийнэ.",
        image: "/images/service-braces.jpg",
        price: "2,000,000₮-с эхэлнэ",
      },
      {
        id: 5,
        title: "Шүдний цайралт",
        description: "Мэргэжлийн аргаар шүдийг цайруулж, инээмсэглэлийг тань илүү гэрэлтүүлнэ.",
        image: "/images/service-whitening.jpg",
        price: "250,000₮-с эхэлнэ",
      },
      {
        id: 6,
        title: "Хүүхдийн шүдний эмчилгээ",
        description: "Хүүхдийн шүдний онцлогт тохирсон эмчилгээг хийж, эрүүл зуршил төлөвшүүлэхэд тусална.",
        image: "/images/service-pediatric.jpg",
        price: "40,000₮-с эхэлнэ",
      },
      {
        id: 7,
        title: "Яаралтай тусламж",
        description: "Шүдний өвдөлт, гэмтэл зэрэг яаралтай тохиолдолд хурдан шуурхай тусламж үзүүлнэ.",
        image: "/images/service-emergency.jpg",
        price: "100,000₮-с эхэлнэ",
      },
      {
        id: 8,
        title: "Шүдний титэм, гүүр",
        description: "Эвдэрсэн, гэмтсэн шүдийг сэргээх, алдагдсан шүдийг орлуулах шийдэл.",
        image: "/images/service-crown.jpg",
        price: "300,000₮-с эхэлнэ",
      },
    ]

    return NextResponse.json({ success: true, services })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
