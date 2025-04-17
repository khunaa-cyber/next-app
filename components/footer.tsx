import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-box">
          <Image src="/logo.png" alt="Dental Clinic Logo" width={200} height={120} />
        </div>

        <div className="footer-box">
          <h2 className="logo">Тусламж</h2>
          <Link href="/book-online">Түгээмэл асуулт</Link>
          <Link href="#">Санал хүсэлт</Link>
        </div>
        

        <div className="footer-box">
          <h2 className="logo">Холбоо барих</h2>
          <a href="tel:+97677007700">+976 - 77007700</a>
          <a href="mailto:info@dentalclinic.mn">info@dentalclinic.mn</a>
        </div>

        <div className="social-icons">
          <a href="#">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>

      <div className="copyright">
        <p>created by Зургаадугаар баг ICSI301</p>
      </div>
    </footer>
  )
}

