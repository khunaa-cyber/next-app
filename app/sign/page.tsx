import { Footer } from "@/components/footer"
import { SignForm } from "./sign-form"
import "./sign.css"

export default function SignPage() {
  return (
    <>
      <main className="sign-page">
        <SignForm />
      </main>
      <Footer />
    </>
  )
}
