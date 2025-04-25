import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FeedbackForm } from "./feedback"
import "./feedback.css"

export default function FeedbackPage() {
  return (
    <>
      <Header />
      <main className="feedback-page">
        <div className="page-banner">
          <h1>Санал хүсэлт</h1>
          <p>Таны санал хүсэлт бидний үйлчилгээг сайжруулахад тусална</p>
        </div>
        <FeedbackForm />
      </main>
      <Footer />
    </>
  )
}
