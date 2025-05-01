import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FAQContent } from "./faq"
import "./faq.css"

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="faq-page">
        <div className="page-banner">
          <h1>Нийтлэг асуултууд</h1>
          <p>Үйлчлүүлэгчдийн түгээмэл асуултууд болон хариултууд</p>
        </div>
        <FAQContent />
      </main>
      <Footer />
    </>
  )
}
