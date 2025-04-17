"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function FacilitySlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const facilityImages = [
    "/IMG_5351.PNG",
    "/IMG_5352.PNG",
    "/IMG_5353.PNG",
    "/IMG_5354.PNG",
    "/IMG_5355.PNG",
    "/IMG_5356.PNG",
    "/IMG_5357.PNG",
    "/IMG_5358.PNG",
    "/IMG_5359.PNG",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      moveSlide(1)
    }, 4000)

    return () => clearInterval(interval)
  }, [currentSlide])

  const moveSlide = (direction) => {
    setCurrentSlide((prev) => {
      let newSlide = prev + direction
      if (newSlide < 0) newSlide = facilityImages.length - 1
      if (newSlide >= facilityImages.length) newSlide = 0
      return newSlide
    })
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="facility-slider">
      <div className="slideshow-container">
        <div className="slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {facilityImages.map((image, index) => (
            <div className="slide" key={index}>
              <Image src={image || "/placeholder.svg"} alt={`Facility image ${index + 1}`} width={1200} height={600} />
            </div>
          ))}
        </div>

        <button className="prev" onClick={() => moveSlide(-1)}>
          &#10094;
        </button>
        <button className="next" onClick={() => moveSlide(1)}>
          &#10095;
        </button>
      </div>

      <div className="dots">
        {facilityImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  )
}

