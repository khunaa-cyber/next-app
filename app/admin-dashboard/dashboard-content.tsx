'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';

export function AdminDashboardContent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

  const auth = useAuth();
  const { user, isLoading } = auth;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push('/sign');
      } else if (user.role !== 'admin') {
        router.push('/sign');
      }
    }
  }, [user, isLoading, router, mounted]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    try {
      const statsResponse = await fetch('/api/admin/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      const appointmentsResponse = await fetch('/api/admin/appointments');
      const appointmentsData = await appointmentsResponse.json();
      setRecentAppointments(appointmentsData);

      const doctorsResponse = await fetch('/api/admin/doctors');
      const doctorsData = await doctorsResponse.json();
      setDoctors(doctorsData);

      const servicesResponse = await fetch('/api/admin/services');
      const servicesData = await servicesResponse.json();
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Уншиж байна...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <main className='admin-dashboard-page'>
      <div className='dashboard-header'>
        <h1>Админ хэсэг</h1>
        <p>Сайн байна уу, {user?.name}!</p>
      </div>

      <section className='dashboard-content'>
        <div className='dashboard-sidebar'>
          <div className='admin-info'>
            <div className='admin-avatar'>
              <div className='avatar-placeholder'>{user?.name.charAt(0)}</div>
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>

          <div className='dashboard-nav'>
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className='fa-solid fa-chart-line'></i>
              Ерөнхий мэдээлэл
            </button>
            <button
              className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <i className='fa-solid fa-calendar-check'></i>
              Цаг захиалга
            </button>
            <button
              className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctors')}
            >
              <i className='fa-solid fa-user-doctor'></i>
              Эмч нар
            </button>
            <button
              className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              <i className='fa-solid fa-user-group'></i>
              Үйлчлүүлэгчид
            </button>
            <button
              className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <i className='fa-solid fa-tooth'></i>
              Үйлчилгээнүүд
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className='fa-solid fa-gear'></i>
              Тохиргоо
            </button>
          </div>
        </div>

        <div className='dashboard-main'>
          {activeTab === 'overview' && stats && (
            <div className='overview-section'>
              <div className='stats-cards'>
                <div className='stat-card'>
                  <div className='stat-icon'>
                    <i className='fa-solid fa-calendar-check'></i>
                  </div>
                  <div className='stat-info'>
                    <h3>Нийт цаг захиалга</h3>
                    <p>{stats.appointments}</p>
                  </div>
                </div>

                <div className='stat-card'>
                  <div className='stat-icon'>
                    <i className='fa-solid fa-user-group'></i>
                  </div>
                  <div className='stat-info'>
                    <h3>Нийт үйлчлүүлэгчид</h3>
                    <p>{stats.patients}</p>
                  </div>
                </div>

                <div className='stat-card'>
                  <div className='stat-icon'>
                    <i className='fa-solid fa-user-doctor'></i>
                  </div>
                  <div className='stat-info'>
                    <h3>Нийт эмч нар</h3>
                    <p>{stats.doctors}</p>
                  </div>
                </div>

                <div className='stat-card'>
                  <div className='stat-icon'>
                    <i className='fa-solid fa-money-bill-wave'></i>
                  </div>
                  <div className='stat-info'>
                    <h3>Нийт орлого</h3>
                    <p>{stats.revenue}</p>
                  </div>
                </div>
              </div>

              <div className='recent-appointments'>
                <h2>Сүүлийн цаг захиалгууд</h2>
                <table className='appointments-table'>
                  <thead>
                    <tr>
                      <th>Огноо</th>
                      <th>Цаг</th>
                      <th>Үйлчлүүлэгч</th>
                      <th>Эмч</th>
                      <th>Үйлчилгээ</th>
                      <th>Төлөв</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.patient}</td>
                        <td>{appointment.doctor}</td>
                        <td>{appointment.service}</td>
                        <td>
                          <span className='status'>{appointment.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className='doctors-section'>
              <div className='section-header'>
                <h2>Эмч нар</h2>
                <button className='button' onClick={() => {}} >Эмч нэмэх</button>
              </div>

              <div className='doctors-list'>
                <table className='doctors-table'>
                  <thead>
                    <tr>
                      <th>Нэр</th>
                      <th>Мэргэжил</th>
                      <th>Цаг захиалга</th>
                      <th>Үнэлгээ</th>
                      <th>Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>{doctor.name}</td>
                        <td>{doctor.position}</td>
                        <td>{doctor.appointments}</td>
                        <td>{doctor.rating}</td>
                        <td>
                          <button className='button small'>Засах</button>
                          <button className='button small delete'>
                            Устгах
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className='services-section'>
              <div className='section-header'>
                <h2>Үйлчилгээнүүд</h2>
                <button className='button'>Үйлчилгээ нэмэх</button>
              </div>

              <div className='services-list'>
                <table className='services-table'>
                  <thead>
                    <tr>
                      <th>Нэр</th>
                      <th>Үнэ</th>
                      <th>Цаг захиалга</th>
                      <th>Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.name}</td>
                        <td>{service.price}</td>
                        <td>{service.appointments}</td>
                        <td>
                          <button className='button small'>Засах</button>
                          <button className='button small delete'>
                            Устгах
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
