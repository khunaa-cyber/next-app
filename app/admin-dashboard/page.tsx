import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminDashboardContent } from "./dashboard-content"
import "./admin.css"

export default function AdminDashboardPage() {
  return (
    <>
      <Header />
      <AdminDashboardContent />
      <Footer />
    </>
  )
}
