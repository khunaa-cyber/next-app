import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './doctor.css';

// Define the Doctor interface
interface Doctor {
  id: string;
  name: string;
  position: string;
  experience: string;
  education: string;
  specialization: string;
  image?: string;
}

export default function DoctorsPage() {


  return (
    <>
      <Header />
      <main className='doctors-page'>
        <div className='page-banner'>
          <h1>Манай эмч нар</h1>
          <p>
            Манай мэргэжлийн, туршлагатай эмч нар таны шүдний эрүүл мэндийн
            төлөө үйлчилнэ
          </p>
        </div>

        <section className='doctors-list'>
          <div className='doctors-grid'>
            {doctors.map((doctor) => (
              <div className='doctor-card' key={doctor.id}>
                <div className='doctor-image'>
                  <Image
                    src={doctor.image || '/placeholder.svg'}
                    alt={doctor.name}
                    width={300}
                    height={300}
                    className='object-cover'
                  />
                </div>
                <div className='doctor-details'>
                  <h2>{doctor.name}</h2>
                  <h3>{doctor.position}</h3>
                  <p>
                    <strong>Туршлага:</strong> {doctor.experience}
                  </p>
                  <p>
                    <strong>Боловсрол:</strong> {doctor.education}
                  </p>
                  <p>
                    <strong>Мэргэшил:</strong> {doctor.specialization}
                  </p>
                  <Link href={`/book-online?doctor=${doctor.id}`}>
                    <button className='button'>Цаг захиалах</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
