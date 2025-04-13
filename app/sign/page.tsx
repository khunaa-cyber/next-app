import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignForm } from "./sign-form"
import "./sign.css"

export default function SignPage() {
  return (
    <>
      <Header />
      <main className="sign-page">
        <SignForm />
      </main>
      <Footer />
    </>
  )
}

