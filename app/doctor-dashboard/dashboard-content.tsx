"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { PatientsSection } from "./patientsSection";
import { userAPI, appointmentsAPI } from "../../lib/api"; // appointmentsAPI-г импортлосон
import { Appointment, Patient } from "../../lib/types";

export function DoctorDashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("appointments");
  const [isLoading, setIsLoading] = useState(true); // Эхлээд true байна
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [treatmentNote, setTreatmentNote] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        setIsLoading(true); // Өгөгдөл татаж эхлэхэд true болгох
        try {
          // Жишээ: Эмчийн цаг захиалга болон үйлчлүүлэгчдийг татах
          // Бодит API дуудалтаар солих шаардлагатай
          // const appointmentsResponse = await appointmentsAPI.getDoctorAppointments(user.id, selectedDate);
          // setAppointments(appointmentsResponse.data);

          // const patientsResponse = await userAPI.getPatientsByDoctorId(user.id);
          // setPatients(patientsResponse.data);

          // Түр жишээ өгөгдөл (API холболт хийгдтэл)
          setAppointments([
            // {id: '1', date: selectedDate, time: '09:00', patientName: 'Болд', service: 'Шүд цэвэрлэх', status: 'Товлосон'},
            // {id: '2', date: selectedDate, time: '10:00', patientName: 'Дорж', service: 'Суваг эмчилгээ', status: 'Дууссан'},
          ]);
          setPatients([
            // {id: 'p1', name: 'Сараа', age: 30, phone: '99XXXXXX', email: 'saraa@example.com', lastVisit: '2023-10-10'},
          ]);

          setMessage({ text: "", type: "" }); // Амжилттай бол зурвасыг арилгах
        } catch (error) {
          console.error("Failed to fetch data:", error);
          setMessage({
            text: "Мэдээлэл татахад алдаа гарлаа.",
            type: "error",
          });
          setAppointments([]); // Алдаа гарвал хоосон болгох
          setPatients([]); // Алдаа гарвал хоосон болгох
        } finally {
          setIsLoading(false); // Өгөгдөл татаж дууссаны дараа (амжилттай эсвэл алдаатай) false болгох
        }
      } else {
        // Хэрэглэгч байхгүй бол (жишээ нь, нэвтрээгүй)
        setIsLoading(false);
        setAppointments([]);
        setPatients([]);
      }
    };

    fetchData();
  }, [user?.id, selectedDate]); // user.id эсвэл selectedDate өөрчлөгдөхөд дахин татна

  // Жишээ: filteredAppointments (бодит логикоор солих шаардлагатай)
  const filteredAppointments: Appointment[] = appointments.filter(
    (app) => app.date === selectedDate // Энэ бол зүгээр таамаг шүү
  );

  // Жишээ: viewPatientHistory (бодит логикоор солих шаардлагатай)
  const viewPatientHistory = (patientId: string) => {
    console.log("Viewing history for patient:", patientId);
    // Энд өвчтөний түүхийг харуулах логик орно
    // Жишээ нь, router.push(`/doctor-dashboard/patients/${patientId}`);
  };

  // Жишээ: startAppointment (бодит логикоор солих шаардлагатай)
  const startAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDiagnosis(appointment.status === "Дууссан" ? "Онош байхгүй" : ""); // Жишээ, бодит оношийг татах
    setTreatmentNote(
      appointment.status === "Дууссан" ? "Тэмдэглэл байхгүй" : ""
    ); // Жишээ, бодит тэмдэглэлийг татах
    setShowNoteModal(true);
  };

  // Жишээ: closeNoteModal (бодит логикоор солих шаардлагатай)
  const closeNoteModal = () => {
    setShowNoteModal(false);
    setSelectedAppointment(null);
    setDiagnosis("");
    setTreatmentNote("");
  };

  // Жишээ: saveAppointmentNotes (бодит логикоор солих шаардлагатай)
  const saveAppointmentNotes = async () => {
    if (!selectedAppointment) return;
    console.log("Saving notes for appointment:", selectedAppointment.id, {
      diagnosis,
      treatmentNote,
    });

    closeNoteModal(); // Түр хаалт
  };

  // Жишээ: handleDateChange (бодит логикоор солих шаардлагатай)
  const handleDateChange = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  return (
    <main className="doctor-dashboard-page">
      <div className="dashboard-header">
        <h1>Эмчийн хэсэг</h1>
        <p>Сайн байна уу, {user?.name}!</p>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </div>

      <section className="dashboard-content">
        <div className="dashboard-sidebar">
          <div className="doctor-info">
            <div className="doctor-avatar">
              <div className="avatar-placeholder">{user?.name?.charAt(0)}</div>
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>

          <div className="dashboard-nav">
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
              className={`nav-item ${activeTab === "patients" ? "active" : ""}`}
              onClick={() => setActiveTab("patients")}
            >
              <i className="fa-solid fa-user-group"></i>
              Үйлчлүүлэгчид
            </button>
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fa-solid fa-user"></i>
              Миний мэдээлэл
            </button>
          </div>
        </div>

        <div className="dashboard-main">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Уншиж байна...</p>
            </div>
          ) : (
            <>
              {activeTab === "appointments" && (
                <div className="appointments-section">
                  <div className="section-header">
                    <h2>Өнөөдрийн цаг захиалга</h2>
                    <div className="date-selector">
                      <button
                        className="date-nav"
                        onClick={() => handleDateChange("prev")}
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <span>{selectedDate}</span>
                      <button
                        className="date-nav"
                        onClick={() => handleDateChange("next")}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>

                  <div className="appointments-list">
                    {filteredAppointments.length > 0 ? (
                      <table className="appointments-table">
                        <thead>
                          <tr>
                            <th>Цаг</th>
                            <th>Үйлчлүүлэгч</th>
                            <th>Үйлчилгээ</th>
                            <th>Төлөв</th>
                            <th>Үйлдэл</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.map(
                            (appointment: Appointment) => (
                              <tr key={appointment.id}>
                                <td>{appointment.time}</td>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.service}</td>
                                <td>
                                  <span
                                    className={`status ${appointment.status.toLowerCase()}`}
                                  >
                                    {appointment.status}
                                  </span>
                                </td>
                                <td>
                                  {appointment.status === "Товлосон" ? (
                                    <button
                                      className="button small"
                                      onClick={() =>
                                        startAppointment(appointment)
                                      }
                                    >
                                      Эмчлэх
                                    </button>
                                  ) : (
                                    <button
                                      className="button small view"
                                      onClick={() =>
                                        startAppointment(appointment)
                                      }
                                    >
                                      Харах
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <div className="no-appointments">
                        {/* PatientsSection-ийг энд харуулах нь зохимжгүй байж магадгүй. */}
                        {/* <PatientsSection patients={patients} viewPatientHistory={viewPatientHistory}/> */}
                        <p>Энэ өдөр цаг захиалга байхгүй байна.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "patients" && (
                <PatientsSection
                  patients={patients} // "patient" байсныг "patients" болгож зассан
                  viewPatientHistory={viewPatientHistory}
                />
              )}

              {activeTab === "profile" && (
                <div className="profile-section">
                  <div className="section-header">
                    <h2>Миний мэдээлэл</h2>
                  </div>

                  <div className="profile-form">
                    <div className="form-group">
                      <label>Нэр</label>
                      <input type="text" value={user?.name} readOnly />
                    </div>

                    <div className="form-group">
                      <label>Имэйл</label>
                      <input type="email" value={user?.email} readOnly />
                    </div>

                    <div className="form-group">
                      <label>Мэргэжил</label>
                      <input type="text" value="Шүдний эмч" readOnly />
                    </div>

                    <div className="form-group">
                      <label>Туршлага</label>
                      <input type="text" value="10 жил" readOnly />
                    </div>

                    <div className="form-group">
                      <label>Мэргэшил</label>
                      <input
                        type="text"
                        value="Ерөнхий шүдний эмчилгээ"
                        readOnly
                      />
                    </div>

                    <button className="button">Мэдээлэл шинэчлэх</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Эмчилгээний тэмдэглэл бичих цонх */}
      {showNoteModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Эмчилгээний тэмдэглэл</h3>
              <button className="close-button" onClick={closeNoteModal}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="appointment-info">
                <p>
                  <strong>Үйлчлүүлэгч:</strong>{" "}
                  {selectedAppointment?.patientName}
                </p>
                <p>
                  <strong>Үйлчилгээ:</strong> {selectedAppointment?.service}
                </p>
                <p>
                  <strong>Огноо:</strong> {selectedAppointment?.date}
                </p>
                <p>
                  <strong>Цаг:</strong> {selectedAppointment?.time}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis">Онош</label>
                <input
                  type="text"
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Оношийг оруулна уу"
                  readOnly={selectedAppointment?.status === "Дууссан"}
                />
              </div>

              <div className="form-group">
                <label htmlFor="treatment-note">Эмчилгээний тэмдэглэл</label>
                <textarea
                  id="treatment-note"
                  rows={5}
                  value={treatmentNote}
                  onChange={(e) => setTreatmentNote(e.target.value)}
                  placeholder="Эмчилгээний тэмдэглэл, зөвлөмж бичнэ үү..."
                  readOnly={selectedAppointment?.status === "Дууссан"}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button className="button cancel" onClick={closeNoteModal}>
                Хаах
              </button>
              {selectedAppointment?.status !== "Дууссан" && (
                <button className="button" onClick={saveAppointmentNotes}>
                  Хадгалах
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
