"use client"

import { useEffect } from "react"
import Image from "next/image"

export function HomeSlider() {
  useEffect(() => {
    const handleScroll = () => {
      const bars = document.querySelector(".fa-bars")
      const navbar = document.querySelector(".navbar")
      const header = document.querySelector("header")

      if (bars) bars.classList.remove("active")
      if (navbar) navbar.classList.remove("nav-toggle")

      if (window.scrollY > 30) {
        if (header) header.classList.add("header-active")
      } else {
        if (header) header.classList.remove("header-active")
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("load", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("load", handleScroll)
    }
  }, [])

  return (
    <div className="home-slider">
      <Image src="/home.jpeg" alt="Dental clinic" fill priority className="object-cover" />
    </div>
  )
}

