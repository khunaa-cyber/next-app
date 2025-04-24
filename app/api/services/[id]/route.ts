import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Mock data for services
    const services = [
      {
        id: 1,
        title: "Шүдний цэвэрлэгээ",
        description: "Мэргэжлийн шүдний эмч нар таны шүдийг гүнзгий цэвэрлэж, өнгөлж, эрүүл байлгахад тусална.",
        detailedDescription:
          "Шүдний цэвэрлэгээ нь шүдний эрүүл мэндийг хадгалах хамгийн чухал арга юм. Энэ үйлчилгээ нь шүдний өнгөн гадаргуу дээр үүссэн өнгөр, чулуу, толбыг арилгаж, шүдийг цэвэрлэж, гялалзуулдаг. Мэргэжлийн шүдний эмч нар тусгай багаж, тоног төхөөрөмж ашиглан таны шүдийг гүнзгий цэвэрлэж, өнгөлж, эрүүл байлгахад тусална. Шүдний цэвэрлэгээг 6 сар тутамд хийлгэхийг зөвлөдөг.",
        image: "/images/service-cleaning.jpg",
        price: "50,000₮-с эхэлнэ",
        duration: "30-60 минут",
        benefits: [
          "Шүдний өнгөр, чулуу арилгана",
          "Шүдний өнгийг сайжруулна",
          "Амны үнэрийг багасгана",
          "Буйлны өвчнөөс сэргийлнэ",
          "Шүдний цоорлоос урьдчилан сэргийлнэ",
        ],
        recommendedFrequency: "6 сар тутамд",
      },
      {
        id: 2,
        title: "Шүдний ломбо",
        description: "Орчин үеийн материал ашиглан шүдний цоорлыг засаж, шүдний анхны хэлбэр, үүргийг сэргээнэ.",
        detailedDescription:
          "Шүдний ломбо нь шүдний цоорол, гэмтлийг засах хамгийн түгээмэл арга юм. Энэ үйлчилгээ нь цоорсон шүдийг цэвэрлэж, орчин үеийн материал ашиглан шүдний анхны хэлбэр, үүргийг сэргээдэг. Манай эмнэлэг нь өндөр чанартай, удаан эдэлгээтэй, шүдний өнгөтэй ижил материалуудыг ашигладаг тул ломбо тавиулсан шүд нь бусад шүднээс ялгарахгүй.",
        image: "/images/service-filling.jpg",
        price: "80,000₮-с эхэлнэ",
        duration: "30-90 минут",
        benefits: [
          "Шүдний цоорлыг арилгана",
          "Шүдний гэмтлийг засна",
          "Шүдний хэлбэр, үүргийг сэргээнэ",
          "Шүдний өвдөлтийг арилгана",
          "Шүдийг хадгалж үлдэхэд тусална",
        ],
        recommendedFrequency: "Шаардлагатай үед",
      },
      // Add more detailed service data for other services
    ]

    const service = services.find((s) => s.id === id)

    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error(`Error fetching service with ID ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
