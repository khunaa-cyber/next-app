import Image from "next/image"
import Link from "next/link"

export function ContactSection() {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="clinic-photo">
          <Image src="/three.png" alt="Dental clinic" width={500} height={500} />
        </div>

        <div className="clinic-info">
          <h3 className="heading">Цаг авахад хялбар!</h3>
          <p>
            Та манай вэб сайтаар дамжуулан онлайнаар цаг захиалах эсвэл
            <br /> 77007700 дугаарт залгаж бидэнтэй холбогдоорой.
            <br />
            <br />
            Нэг өдрийн дотор цаг авах боломжтой
            <br />
            Бид таныг чин сэтгэлээсээ угтан авахыг тэсэн ядан хүлээж байна!
            <br />
            <br />
            Ажлын цаг:
            <br />
            Даваа –Баасан: 09:00 – 18:00
            <br />
            Бямба, Ням гараг: амарна.
            <br />
            <br />
            Холбогдох утас: (976) 77007700
            <br />
          </p>

          <div className="contact-buttons">
            <Link href="/book-online">
              <button className="button">Цаг Захиалах</button>
            </Link>
            <a href="tel:+97677007700">
              <button className="button">Холбогдох</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

