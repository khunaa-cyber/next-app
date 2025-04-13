import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DoctorDashboardContent } from "./dashboard-content"
import "../doctors/doctor.css"

export default function DoctorDashboardPage() {
  return (
    <>
      <Header />
      <DoctorDashboardContent />
      <Footer />
    </>
  )
}

