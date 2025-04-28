'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ServiceSlider from '@/components/service-slider';
import './service.css';

interface Service {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Үйлчилгээнүүдийг ачаалах үед алдаа гарлаа:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className='services-page'>
        <div className='page-banner'>
          <h1>Үйлчилгээнүүд</h1>
          <p>
            Бид таны шүдний эрүүл мэндийн бүх хэрэгцээг хангах иж бүрэн
            үйлчилгээг санал болгож байна
          </p>
        </div>

        <section className='services-list'>
          <div className='services-grid'>
            {loading ? (
              <p>Үйлчилгээнүүдийг ачааллаж байна...</p>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div className='service-card' key={service.id}>
                  <div className='service-image'>
                    {service.images?.length ? (
                      <ServiceSlider
                        title={service.title}
                        images={service.images}
                      />
                    ) : (
                      <Image
                        src='/placeholder.svg'
                        alt={service.title}
                        width={400}
                        height={250}
                      />
                    )}
                  </div>
                  <div className='service-details'>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>
                    <div className='service-price'>
                      <span>{service.price}</span>
                    </div>
                    <button
                      className='button'
                      onClick={() =>
                        setExpandedServiceId(
                          expandedServiceId === service.id ? null : service.id
                        )
                      }
                    >
                      {expandedServiceId === service.id
                        ? 'Хураах'
                        : 'Дэлгэрэнгүй'}
                    </button>
                  </div>
                  {expandedServiceId === service.id && (
                    <div className='service-expanded'>
                      <p>Энд дэлгэрэнгүй мэдээлэл байна.</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Одоогоор үйлчилгээ олдсонгүй.</p>
            )}
          </div>
        </section>

        <section className='service-cta'>
          <div className='cta-content'>
            <h2>Эрүүл шүд, гэрэлтсэн инээмсэглэлтэй болохыг хүсч байна уу?</h2>
            <p>Манай мэргэжлийн баг танд туслахад бэлэн байна</p>
            <Link href='/book-online'>
              <button className='button'>Цаг захиалах</button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
