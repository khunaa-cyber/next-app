"use client"

import type React from "react"
import Slider from "react-slick"
import Image from "next/image"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface ServiceSliderProps {
  title: string
  images: string[]
}

const ServiceSlider: React.FC<ServiceSliderProps> = ({ title, images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <Slider {...settings}>
      {images.map((img, idx) => (
        <Image key={idx} src={img} alt={`${title} зураг`} width={400} height={250} className="object-cover" />
      ))}
    </Slider>
  )
}

export default ServiceSlider
