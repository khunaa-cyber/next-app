import Image from "next/image"

export function LocationsSection() {
  const locations = [
    {
      district: "Сүхбаатар дүүрэг",
      address: "СБД, 1-р хороо, Чингисийн өргөн чөлөө, Төв шуудангийн зүүн талд.",
      image: "/outside1.JPG",
    },
    {
      district: "Баянзүрх дүүрэг",
      address: "БЗД, 13-р хороолол, Кино үйлдвэрийн автобусны буудлын урд.",
      image: "/outside2.JPG",
    },
    {
      district: "Хан-Уул дүүрэг",
      address: "ХУД, 19-р хороолол, Зайсангийн зам дагуу, Зайсан Хилл цогцолборын ар талд.",
      image: "/outside4.JPG",
    },
    {
      district: "Сонгинохайрхан дүүрэг",
      address: "СХД, 5 шар, Баруун салаа зам дагуу, Хархорин захын ар талд.",
      image: "/outside3.JPG",
    },
  ]

  return (
    <section className="locations-section">
      <div className="locations-container">
        <div className="location-photos">
          {locations.map((location, index) => (
            <div className="location-card" key={index}>
              <h3>{location.district}</h3>
              <p>{location.address}</p>
              <a href="#">
                <Image src={location.image || "/placeholder.svg"} alt={location.district} width={300} height={200} />
              </a>
            </div>
          ))}
        </div>

        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.179689993619!2d106.88904917625906!3d47.91231917107295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aa1b4b28d0c2e1%3A0x2b7ad7bd2439a4f5!2zMTAtcnJlbiBjaG9yb29sb2wsIPCfjeCfk-CfjOCfl-CfjeCfmCDQkdC10LvRgtGA0LDQuw!5e0!3m2!1sen!2smn!4v1710224345667!5m2!1sen!2smn"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  )
}

