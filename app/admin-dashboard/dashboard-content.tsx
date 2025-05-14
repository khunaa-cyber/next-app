"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth-context";
import { AuthWrapper } from "@/components/auth-wrapper";
import { doctorsAPI, servicesAPI, appointmentsAPI } from "@/lib/api";

// Төрлүүдийг тодорхойлж өгье
interface Doctor {
  id: string;
  name: string;
  specialization: string; // Changed from position to match the API response
  appointments: number;
  rating: number;
}

interface Service {
  id: number;
  name: string;
  price: string;
  appointments: number;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  patient: string;
  doctor: string;
  service: string;
  status: string;
}

interface Stats {
  appointments: number;
  patients: number;
  doctors: number;
  revenue: string;
}

export function AdminDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Өгөгдлийн төлөвүүд
  const [stats, setStats] = useState({
    appointments: 0,
    patients: 0,
    doctors: 0,
    revenue: "0₮",
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // API-аас өгөгдөл татах
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all doctors
        const doctorsResponse = (await doctorsAPI.getAll()) as {
          success: boolean;
          doctors: { id: string; name: string; specialization: string }[];
        };

        // Fetch all services
        const servicesResponse = (await servicesAPI.getAll()) as {
          success: boolean;
          services: { id: number; title: string; price: string }[];
        };

        // Fetch all appointments
        const appointmentsResponse = (await appointmentsAPI.getByUserId(
          "1"
        )) as {
          success: boolean;
          appointments: {
            id: string;
            date: string;
            time: string;
            doctorId: string;
            doctorName: string;
            service: string;
            status: string;
          }[];
        };

        if (doctorsResponse.success && appointmentsResponse.success) {
          // Count appointments for each doctor
          const doctorAppointmentCounts: { [key: string]: number } = {};
          const doctorRatings: { [key: string]: number } = {};

          // Initialize counts and ratings
          doctorsResponse.doctors.forEach((doctor) => {
            doctorAppointmentCounts[doctor.id] = 0;
            doctorRatings[doctor.id] = 0;
          });

          // Count appointments for each doctor
          appointmentsResponse.appointments.forEach((appointment) => {
            if (
              appointment.doctorId &&
              doctorAppointmentCounts[appointment.doctorId] !== undefined
            ) {
              doctorAppointmentCounts[appointment.doctorId]++;
            }
          });

          // Set default ratings (could be replaced with actual ratings from reviews)

          // Map doctors with actual appointment counts
          setDoctors(
            doctorsResponse.doctors.map((doctor) => ({
              id: doctor.id,
              name: doctor.name,
              specialization: doctor.specialization,
              appointments: doctorAppointmentCounts[doctor.id] || 0,
              rating: doctorRatings[doctor.id] || 4.0,
            }))
          );
        }

        if (servicesResponse.success) {
          // Count appointments for each service
          const serviceAppointmentCounts: { [key: string]: number } = {};

          // Initialize counts
          servicesResponse.services.forEach((service) => {
            serviceAppointmentCounts[service.title] = 0;
          });

          // Count appointments for each service
          if (appointmentsResponse.success) {
            appointmentsResponse.appointments.forEach((appointment) => {
              if (
                appointment.service &&
                serviceAppointmentCounts[appointment.service] !== undefined
              ) {
                serviceAppointmentCounts[appointment.service]++;
              }
            });
          }

          setServices(
            servicesResponse.services.map((service) => ({
              id: service.id,
              name: service.title,
              price: service.price,
              appointments: serviceAppointmentCounts[service.title] || 0,
            }))
          );
        }

        if (appointmentsResponse.success) {
          setRecentAppointments(
            appointmentsResponse.appointments
              .slice(0, 5)
              .map((appointment) => ({
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                patient: "Үйлчлүүлэгч", // Replace with actual patient name if available
                doctor: appointment.doctorName,
                service: appointment.service,
                status: appointment.status,
              }))
          );

          // Calculate statistics
          let totalRevenue = 0;
          if (servicesResponse.success) {
            // Only count completed appointments
            const completedAppointments =
              appointmentsResponse.appointments.filter(
                (appointment) => appointment.status === "Дууссан"
              );

            // Create a map of service prices
            const servicePrices: { [key: string]: number } = {};
            servicesResponse.services.forEach((service) => {
              const priceString = service.price ? service.price.replace(/[^\d]/g, "") : "0";
              servicePrices[service.title] = Number.parseInt(priceString, 10) || 0;
            });

            // Calculate total revenue
            completedAppointments.forEach((appointment) => {
              const servicePrice = servicePrices[appointment.service] || 0;
              totalRevenue += servicePrice;
            });
          }

          setStats({
            appointments: appointmentsResponse.appointments.length,
            patients: new Set(
              appointmentsResponse.appointments.map((a) => a.id)
            ).size, // Count unique appointments as estimate for patients
            doctors: doctorsResponse.success
              ? doctorsResponse.doctors.length
              : 0,
            revenue: `${totalRevenue.toLocaleString()}₮`,
          });
        }
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ачаалж байгаа үед харуулах
  if (isLoading) {
    return (
      <AuthWrapper requiredRole="admin">
        <main className="admin-dashboard-page">
          <div className="dashboard-header">
            <h1>Админ хэсэг</h1>
            <p>Өгөгдөл ачаалж байна...</p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Уншиж байна...</p>
          </div>
        </main>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper requiredRole="admin">
      <main className="admin-dashboard-page">
        <div className="dashboard-header">
          <h1>Админ хэсэг</h1>
          <p>Сайн байна уу, {user?.name}!</p>
        </div>

        <section className="dashboard-content">
          <div className="dashboard-sidebar">
            <div className="admin-info">
              <div className="admin-avatar">
                <div className="avatar-placeholder">{user?.name.charAt(0)}</div>
              </div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>

            <div className="dashboard-nav">
              <button
                className={`nav-item ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <i className="fa-solid fa-chart-line"></i>
                Ерөнхий мэдээлэл
              </button>
              <button
                className={`nav-item ${
                  activeTab === "appointments" ? "active" : ""
                }`}
                onClick={() => setActiveTab("appointments")}
              >
                <i className="fa-solid fa-calendar-check"></i>
                Цаг захиалга
              </button>
              <button
                className={`nav-item ${
                  activeTab === "doctors" ? "active" : ""
                }`}
                onClick={() => setActiveTab("doctors")}
              >
                <i className="fa-solid fa-user-doctor"></i>
                Эмч нар
              </button>
              <button
                className={`nav-item ${
                  activeTab === "patients" ? "active" : ""
                }`}
                onClick={() => setActiveTab("patients")}
              >
                <i className="fa-solid fa-user-group"></i>
                Үйлчлүүлэгчид
              </button>
              <button
                className={`nav-item ${
                  activeTab === "services" ? "active" : ""
                }`}
                onClick={() => setActiveTab("services")}
              >
                <i className="fa-solid fa-tooth"></i>
                Үйлчилгээнүүд
              </button>
              <button
                className={`nav-item ${
                  activeTab === "audit-logs" ? "active" : ""
                }`}
                onClick={() => setActiveTab("audit-logs")}
              >
                <i className="fa-solid fa-plus"></i>
                Мэдээ нэмэх
              </button>
              <button
                className={`nav-item ${
                  activeTab === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <i className="fa-solid fa-user-doctor"></i>
                Эмчийн бүртгэл зөвшөөрөл
              </button>
            </div>
          </div>

          <div className="dashboard-main">
            {activeTab === "overview" && (
              <div className="overview-section">
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Нийт цаг захиалга</h3>
                      <p>{stats.appointments}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fa-solid fa-user-group"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Нийт үйлчлүүлэгчид</h3>
                      <p>{stats.patients}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fa-solid fa-user-doctor"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Нийт эмч нар</h3>
                      <p>{stats.doctors}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fa-solid fa-money-bill-wave"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Нийт орлого</h3>
                      <p>{stats.revenue}</p>
                    </div>
                  </div>
                </div>

                <div className="recent-appointments">
                  <h2>Сүүлийн цаг захиалгууд</h2>
                  <table className="appointments-table">
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
                      {recentAppointments.map((appointment, index) => (
                        <tr key={appointment.id || index}>
                          <td>{appointment.date}</td>
                          <td>{appointment.time}</td>
                          <td>{appointment.patient}</td>
                          <td>{appointment.doctor}</td>
                          <td>{appointment.service}</td>
                          <td>
                            <span className="status">{appointment.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "doctors" && (
              <div className="doctors-section">
                <div className="section-header">
                  <h2>Эмч нар</h2>
                  <button className="button">Эмч нэмэх</button>
                </div>

                <div className="doctors-list">
                  <table className="doctors-table">
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
                          <td>{doctor.specialization}</td>
                          <td>{doctor.appointments}</td>
                          <td>{doctor.rating}</td>
                          <td>
                            <button className="button small">Засах</button>
                            <button className="button small delete">
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

            {activeTab === "services" && (
              <div className="services-section">
                <div className="section-header">
                  <h2>Үйлчилгээнүүд</h2>
                  <button className="button">Үйлчилгээ нэмэх</button>
                </div>

                <div className="services-list">
                  <table className="services-table">
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
                            <button className="button small">Засах</button>
                            <button className="button small delete">
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

            {activeTab === "appointments" && (
              <div className="appointments-section">
                <div className="section-header">
                  <h2>Цаг захиалгууд</h2>
                </div>

                <div className="appointments-list">
                  <table className="appointments-table">
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
                      {recentAppointments.map((appointment, index) => (
                        <tr key={appointment.id || index}>
                          <td>{appointment.date}</td>
                          <td>{appointment.time}</td>
                          <td>{appointment.patient}</td>
                          <td>{appointment.doctor}</td>
                          <td>{appointment.service}</td>
                          <td>
                            <span className="status">{appointment.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "audit-logs" && <AuditLogs />}
          </div>
        </section>
      </main>
    </AuthWrapper>
  );
}
