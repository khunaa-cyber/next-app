import { Footer } from "@/components/footer"
import RegisterForm from "./register-form"
import "../sign/sign.css"

export default function RegisterPage() {
  return (
    <>
      <main className="sign-page">
        <RegisterForm />
      </main>
      <Footer />
    </>
  )
}
