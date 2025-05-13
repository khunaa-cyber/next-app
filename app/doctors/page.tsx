"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { doctorsAPI } from "../../lib/api"
import { ApiResponse } from "../api/doctors/route"
import "./doctor.css"

interface Doctor {
  id: number
  name: string
  position: string
  experience: string
  education: string
  specialization: string
  branch: string
  image: string
  details?: string
}

export default function DoctorsPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const branches = ["Салбар 1", "Салбар 2", "Салбар 3", "Салбар 4"]
  const [expandedDoctorId, setExpandedDoctorId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await doctorsAPI.getAll()
      const data = response as unknown as ApiResponse
      if (data?.success && data.doctors) {
        const formattedDoctors = data.doctors.map((doctor: any) => ({
          id: doctor._id,
          name: doctor.name,
          position: doctor.profession,
          experience: doctor.experience,
          education: doctor.education,
          specialization: doctor.specialization,
          branch: doctor.Branch,
          image: doctor.image,
          details: doctor.summary
        }))
        setDoctors(formattedDoctors)
          } else {
        const errorMessage = data.message || "No doctors data received"
        setError(errorMessage)
        console.error("Failed to fetch doctors:", errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("Error fetching doctors:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const toggleExpand = (doctorId: number) => {
    setExpandedDoctorId(expandedDoctorId === doctorId ? null : doctorId)
  }

  const filteredDoctors = selectedBranch
    ? doctors.filter((d) => d.branch === selectedBranch)
    : doctors

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <Header />
      <main className="doctors-page">
        <div className="page-banner">
          <h1>Манай эмч нар</h1>
          <p>Манай мэргэжлийн, туршлагатай эмч нар таны шүдний эрүүл мэндийн төлөө үйлчилнэ</p>
        </div>

        <section className="filter-section">
          <h3>Салбар сонгох:</h3>
          <div className="filter-buttons">
            <button
              onClick={() => setSelectedBranch("")}
              className={selectedBranch === "" ? "active" : ""}
            >
              Бүгд
            </button>
            {branches.map((branch) => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={selectedBranch === branch ? "active" : ""}
              >
                {branch}
              </button>
            ))}
          </div>
        </section>

        <section className="doctors-list">
          <div className="doctors-grid">
            {filteredDoctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-image">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={250}
                    height={300}
                    className="doctor-img"
                  />
                </div>
                <div className="doctor-details">
                  <h2>{doctor.name}</h2>
                  <h3>{doctor.position}</h3>
                  <p><strong>Туршлага:</strong> {doctor.experience}</p>
                  <p><strong>Боловсрол:</strong> {doctor.education}</p>
                  <p><strong>Мэргэшил:</strong> {doctor.specialization}</p>
                  <p><strong>Ажиллаж буй салбар:</strong> {doctor.branch}</p>
                  <button className="button" onClick={() => toggleExpand(doctor.id)}>
                    {expandedDoctorId === doctor.id ? "Хураах" : "Дэлгэрэнгүй"}
                  </button>

                  {expandedDoctorId === doctor.id && doctor.details && (
                    <div className="doctor-extra">
                      {doctor.details.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                      <div className="contact-info">
                        <p><strong>Ажлын цаг:</strong> Даваа - Баасан 09:00 - 20:00</p>
                        <p><strong>Утас:</strong> +976 - 70003931</p>
                        <p><strong>Имэйл:</strong> info@cuticul.mn</p>
                        <div className="social">
                          <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Youtube</a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}