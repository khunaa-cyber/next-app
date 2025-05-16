"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth-context";
import { AuthWrapper } from "@/components/auth-wrapper";
import { doctorsAPI, servicesAPI, appointmentsAPI, userAPI } from "@/lib/api";
import { get } from "axios";

// Төрлүүдийг тодорхойлж өгье
interface DoctorForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  education: string;
  summary: string;
  skills: string;
  image: string;
  profession: string;
  specialization: string;
  Branch: string;
  password: string;
}
interface Doctor {
  id: string;
  name: string;
  specialization: string;
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

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

interface CategoryNames {
  [key: string]: string;
  general: string;
  "dental-health": string;
  technology: string;
  events: string;
  promotions: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userAppointmentCount?: number;
}

interface DoctorForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  education: string;
  summary: string;
  skills: string;
  image: string;
  profession: string;
  specialization: string;
  Branch: string;
  password: string;
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
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [doctorFormData, setDoctorFormData] = useState<DoctorForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    experience: "",
    education: "",
    summary: "",
    skills: "",
    image: "/doctor.png", // Default image
    profession: "",
    specialization: "",
    Branch: "Салбар 1",
    password: "",
  });
  const [doctorFormError, setDoctorFormError] = useState("");
  const [doctorFormSuccess, setDoctorFormSuccess] = useState("");

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
            _id: string;
            date: string;
            time: string;
            doctorId: string;
            userId: string;
            service: string;
            status: string;
          }[];
        };
        const usersResponse = (await userAPI.getAll()) as {
          success: boolean;
          users: {
            name: string;
            email: string;
            phone?: string | null;
            appointmentCount?: number | 0;
          }[];
        };
        setUsers(
          usersResponse.users.map((user) => ({
            id: user.email, // Using email as id since there's no id in response
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            userAppointmentCount: user.appointmentCount || 0,
          }))
        );
        const userAppointmentCounts = appointmentsResponse.appointments.reduce(
          (counts: { [key: string]: number }, appointment) => {
            if (appointment._id) {
              counts[appointment._id] = (counts[appointment._id] || 0) + 1;
            }
            return counts;
          },
          {}
        );

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
          // Create lookup tables for faster access to doctor and user names
          const doctorLookup: { [key: string]: string } = {};
          if (doctorsResponse.success) {
            doctorsResponse.doctors.forEach((doctor) => {
              doctorLookup[doctor.id] = doctor.name;
            });
          }

          const userLookup: { [key: string]: string } = {};
          if (usersResponse.success) {
            usersResponse.users.forEach((user) => {
              userLookup[user.email] = user.name;
            });
          }

          console.log(
            "Debug - Appointment data:",
            appointmentsResponse.appointments[0]
          );

          const appointmentsWithNames = await Promise.all(
            appointmentsResponse.appointments
              .slice(0, 5)
              .map(async (appointment) => {
                // Get patient info - first try userId, which should be the correct field
                const patientResponse = (await userAPI.getById(
                  appointment.userId
                )) as {
                  success: boolean;
                  user: { name: string };
                };
                const patientName = patientResponse.success
                  ? patientResponse.user.name
                  : "үйлчлүүлэгч";
                const doctorName = doctorLookup[appointment.doctorId];

                return {
                  id: appointment._id,
                  date: appointment.date,
                  time: appointment.time,
                  patient: patientName,
                  doctor: doctorName,
                  service: appointment.service || "Тодорхойгүй үйлчилгээ",
                  status: appointment.status || "Хүлээгдэж буй",
                };
              })
          );

          setRecentAppointments(appointmentsWithNames);

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
              const priceString = service.price
                ? service.price.replace(/[^\d]/g, "")
                : "0";
              servicePrices[service.title] =
                Number.parseInt(priceString, 10) || 0;
            });

            // Calculate total revenue
            completedAppointments.forEach((appointment) => {
              const servicePrice = servicePrices[appointment.service] || 0;
              totalRevenue += servicePrice;
            });
          }

          setStats({
            appointments: appointmentsResponse.appointments.length,
            patients: usersResponse.success ? usersResponse.users.length : 0,
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

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorFormError("");
    setDoctorFormSuccess("");

    // Basic validation
    if (
      !doctorFormData.name ||
      !doctorFormData.email ||
      !doctorFormData.phone ||
      !doctorFormData.profession ||
      !doctorFormData.specialization ||
      !doctorFormData.password
    ) {
      setDoctorFormError("Бүх талбарыг бөглөнө үү");
      return;
    }

    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorFormData),
      });

      const data = await response.json();

      if (data.success) {
        setDoctorFormSuccess("Эмч амжилттай нэмэгдлээ!");
        setDoctorFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          experience: "",
          education: "",
          summary: "",
          skills: "",
          image: "/doctor.png",
          profession: "",
          specialization: "",
          Branch: "Салбар 1",
          password: "",
        });

        // Refresh doctors list
        const doctorsResponse = (await doctorsAPI.getAll()) as {
          success: boolean;
          doctors: { id: string; name: string; specialization: string }[];
        };

        if (doctorsResponse.success) {
          setDoctors(
            doctorsResponse.doctors.map((doctor) => ({
              id: doctor.id,
              name: doctor.name,
              specialization: doctor.specialization,
              appointments: 0,
              rating: 4.0,
            }))
          );
        }

        // Close the form after a delay
        setTimeout(() => {
          setIsAddingDoctor(false);
          setDoctorFormSuccess("");
        }, 2000);
      } else {
        setDoctorFormError(data.message || "Эмч нэмэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      setDoctorFormError("Эмч нэмэхэд алдаа гарлаа");
    }
  };

  const handleDoctorFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDoctorFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
              {/* <button
                className={`nav-item ${
                  activeTab === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <i className="fa-solid fa-user-doctor"></i>
                Эмчийн бүртгэл зөвшөөрөл
              </button> */}
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
                  <button
                    className="button"
                    onClick={() => setIsAddingDoctor(true)}
                  >
                    Эмч нэмэх
                  </button>
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
            {activeTab === "patients" && (
              <div className="patients-section">
                <div className="section-header">
                  <h2>Үйлчлүүлэгчид</h2>
                  <button className="button">Үйлчлүүлэгч нэмэх</button>
                </div>

                <div className="patients-list">
                  <table className="patients-table">
                    <thead>
                      <tr>
                        <th>Нэр</th>
                        <th>Утас</th>
                        <th>Имэйл хаяг</th>
                        <th>Цаг захиалгууд</th>
                        <th>Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.phone || "Байхгүй"}</td>
                          <td>{user.email}</td>
                          <td>{user.userAppointmentCount || 0}</td>
                          <td>
                            <button className="button small">
                              Дэлгэрэнгүй
                            </button>
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

            {activeTab === "audit-logs" && <AuditLogs />}
          </div>
        </section>
        {/* Doctor Form Modal */}
        {isAddingDoctor && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Шинэ эмч нэмэх</h2>
                <button
                  className="modal-close"
                  onClick={() => setIsAddingDoctor(false)}
                >
                  ×
                </button>
              </div>

              {doctorFormError && (
                <div className="error-message">{doctorFormError}</div>
              )}
              {doctorFormSuccess && (
                <div className="success-message">{doctorFormSuccess}</div>
              )}

              <form onSubmit={handleDoctorSubmit} className="doctor-form">
                <div className="form-group">
                  <label htmlFor="name">Нэр *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={doctorFormData.name}
                    onChange={handleDoctorFormChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Утас *</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={doctorFormData.phone}
                      onChange={handleDoctorFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Имэйл *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={doctorFormData.email}
                      onChange={handleDoctorFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Хаяг *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={doctorFormData.address}
                    onChange={handleDoctorFormChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profession">Мэргэжил *</label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={doctorFormData.profession}
                      onChange={handleDoctorFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialization">Мэргэшил *</label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={doctorFormData.specialization}
                      onChange={handleDoctorFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experience">Туршлага *</label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      value={doctorFormData.experience}
                      onChange={handleDoctorFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="education">Боловсрол *</label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={doctorFormData.education}
                      onChange={handleDoctorFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="summary">Товч танилцуулга *</label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={doctorFormData.summary}
                    onChange={handleDoctorFormChange}
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="skills">Ур чадварууд *</label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={doctorFormData.skills}
                    onChange={handleDoctorFormChange}
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="image">Зураг (URL) *</label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={doctorFormData.image}
                      onChange={handleDoctorFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Branch">Салбар *</label>
                    <select
                      id="Branch"
                      name="Branch"
                      value={doctorFormData.Branch}
                      onChange={handleDoctorFormChange}
                      required
                    >
                      <option value="Салбар 1">Салбар 1</option>
                      <option value="Салбар 2">Салбар 2</option>
                      <option value="Салбар 3">Салбар 3</option>
                      <option value="Салбар 4">Салбар 4</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Нууц үг *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={doctorFormData.password}
                    onChange={handleDoctorFormChange}
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setIsAddingDoctor(false)}
                  >
                    Цуцлах
                  </button>
                  <button type="submit" className="button">
                    Эмч нэмэх
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </AuthWrapper>
  );
}

function AuditLogs() {
  const [newsTitle, setNewsTitle] = useState<string>("");
  const [newsContent, setNewsContent] = useState<string>("");
  const [newsImage, setNewsImage] = useState<string>("");
  const [newsDescription, setNewsDescription] = useState<string>("");
  const [newsCategory, setNewsCategory] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/news");
      const data = await response.json();
      if (data.success) {
        setNewsList(data.news);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newsTitle,
          content: newsContent,
          image: newsImage,
          description: newsDescription,
          category: newsCategory,
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Мэдээ амжилттай нэмэгдлээ!");
        setNewsTitle("");
        setNewsContent("");
        setNewsImage("");
        setNewsDescription("");
        setNewsCategory("general");
        fetchNews();
      } else {
        setErrorMessage(data.message || "Мэдээ нэмэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error adding news:", error);
      setErrorMessage("Мэдээ нэмэхэд алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSuccessMessage("");
    setErrorMessage("");

    // Confirm before deleting
    if (!confirm("Энэ мэдээг устгахдаа итгэлтэй байна уу?")) {
      return;
    }

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Мэдээ амжилттай устгагдлаа!");
        fetchNews();
      } else {
        setErrorMessage(data.message || "Мэдээ устгахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      setErrorMessage("Мэдээ устгахад алдаа гарлаа");
    }
  };

  return (
    <div className="news-management-section">
      <div className="section-header">
        <h2>Мэдээ нэмэх</h2>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-group">
          <label htmlFor="newsTitle">Гарчиг</label>
          <input
            type="text"
            id="newsTitle"
            value={newsTitle}
            onChange={(e) => setNewsTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newsDescription">Товч тайлбар</label>
          <input
            type="text"
            id="newsDescription"
            value={newsDescription}
            onChange={(e) => setNewsDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newsContent">Агуулга</label>
          <textarea
            id="newsContent"
            value={newsContent}
            onChange={(e) => setNewsContent(e.target.value)}
            rows={6}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="newsImage">Зургийн URL</label>
          <input
            type="text"
            id="newsImage"
            value={newsImage}
            onChange={(e) => setNewsImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newsCategory">Ангилал</label>
          <select
            id="newsCategory"
            value={newsCategory}
            onChange={(e) => setNewsCategory(e.target.value)}
            required
          >
            <option value="general">Ерөнхий</option>
            <option value="dental-health">Шүдний эрүүл мэнд</option>
            <option value="technology">Технологи</option>
            <option value="events">Үйл явдал</option>
            <option value="promotions">Урамшуулал</option>
          </select>
        </div>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Нэмж байна..." : "Мэдээ нэмэх"}
        </button>
      </form>

      <div className="news-list-section">
        <h3>Нийтлэгдсэн мэдээнүүд</h3>
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <table className="news-table">
            <thead>
              <tr>
                <th>Гарчиг</th>
                <th>Огноо</th>
                <th>Ангилал</th>
                <th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((news: NewsItem) => (
                <tr key={news._id}>
                  <td>{news.title}</td>
                  <td>{new Date(news.date).toLocaleDateString()}</td>
                  <td>{news.category || "Ерөнхий"}</td>
                  <td>
                    <button
                      className="button small delete"
                      onClick={() => handleDelete(news._id)}
                    >
                      Устгах
                    </button>
                  </td>
                </tr>
              ))}
              {newsList.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    Мэдээ олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [doctorFormData, setDoctorFormData] = useState<DoctorForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    experience: "",
    education: "",
    summary: "",
    skills: "",
    image: "/doctor.png", // Default image
    profession: "",
    specialization: "",
    Branch: "Салбар 1",
    password: "",
  });
  const [doctorFormError, setDoctorFormError] = useState("");
  const [doctorFormSuccess, setDoctorFormSuccess] = useState("");

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorFormError("");
    setDoctorFormSuccess("");

    // Basic validation
    if (
      !doctorFormData.name ||
      !doctorFormData.email ||
      !doctorFormData.phone ||
      !doctorFormData.profession ||
      !doctorFormData.specialization ||
      !doctorFormData.password
    ) {
      setDoctorFormError("Бүх талбарыг бөглөнө үү");
      return;
    }

    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorFormData),
      });

      const data = await response.json();

      if (data.success) {
        setDoctorFormSuccess("Эмч амжилттай нэмэгдлээ!");
        setDoctorFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          experience: "",
          education: "",
          summary: "",
          skills: "",
          image: "/doctor.png",
          profession: "",
          specialization: "",
          Branch: "Салбар 1",
          password: "",
        });

        // Refresh doctors list
        const doctorsResponse = (await doctorsAPI.getAll()) as {
          success: boolean;
          doctors: { id: string; name: string; specialization: string }[];
        };

        if (doctorsResponse.success) {
          setDoctors(
            doctorsResponse.doctors.map((doctor) => ({
              id: doctor.id,
              name: doctor.name,
              specialization: doctor.specialization,
              appointments: 0,
              rating: 4.0,
            }))
          );
        }

        // Close the form after a delay
        setTimeout(() => {
          setIsAddingDoctor(false);
          setDoctorFormSuccess("");
        }, 2000);
      } else {
        setDoctorFormError(data.message || "Эмч нэмэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      setDoctorFormError("Эмч нэмэхэд алдаа гарлаа");
    }
  };

  const handleDoctorFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDoctorFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
}
function setDoctors(
  arg0: {
    id: string;
    name: string;
    specialization: string;
    appointments: number;
    rating: number;
  }[]
) {
  throw new Error("Function not implemented.");
}
