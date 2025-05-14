"use client";

import { useState } from "react";
import Image from "next/image";

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      image: "/img-1.jpg",
      comment:
        "Шүдний эмнэлэгт очиход эмч нарын хандлага сайн байсан. Үйлчилгээ нь түр хугацаанд хүлээлгээд, үнэ багагүй байсан. Гэхдээ эмчийн зөвлөгөө нь зөв байсныг ойлгосон.",
      author: "Ану",
      rating: 5,
    },
    {
      image: "/img-2.jpg",
      comment:
        "Үйлчилгээний орчин цэвэрхэн, эмч маш найрсаг байсан. Энд дахиж ирнэ гэж бодож байна!",
      author: "Мөнхбаяр",
      rating: 5,
    },
    {
      image: "/img-3.jpg",
      comment:
        "Маш сэтгэл ханамжтай байна. Сэтгэгдэл маш эерэг байна шүү. Баярлалаа!",
      author: "Сараа",
      rating: 5,
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="testimonial-slider">
      <div className="slider-container">
        <div
          className="comment-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div className="comment-slide" key={index}>
              <div className="comment-image">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={`${testimonial.author}'s photo`}
                  width={150}
                  height={150}
                />
              </div>
              <div className="user-content">
                <div className="star">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i className="fa-solid fa-star" key={i}></i>
                  ))}
                </div>
                <p>{testimonial.comment}</p>
                <h3 className="author">
                  <strong>{testimonial.author}</strong>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="slider-buttons">
        <button onClick={prevSlide}>←</button>
        <button onClick={nextSlide}>→</button>
      </div>
    </div>
  );
}
