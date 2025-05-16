"use client";

import { useState, useEffect } from "react";
import { userAPI, appointmentsAPI } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import React from "react";
import { Patient, PatientHistoryRecord } from "../../lib/types"; // Төвлөрсөн төрлийг импортлох

interface PatientsSectionProps {
  patients: Patient[];
  viewPatientHistory: (patientId: string) => void;
}

export function PatientsSection({
  patients,
  viewPatientHistory,
}: PatientsSectionProps) {
  return (
    <div className="patients-section">
      <div className="section-header">
        <h2>Үйлчлүүлэгчид</h2>
        <div className="search-box">
          <input type="text" placeholder="Хайх..." />
          <button>
            <i className="fa-solid fa-search"></i>
          </button>
        </div>
      </div>

      <div className="patients-list">
        {patients.length > 0 ? (
          <table className="patients-table">
            <thead>
              <tr>
                <th>Нэр</th>
                <th>Нас</th>
                <th>Утас</th>
                <th>Имэйл</th>
                <th>Сүүлийн үзлэг</th>
                <th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.age !== undefined ? patient.age : "N/A"}</td>
                  <td>{patient.phone !== undefined ? patient.phone : "N/A"}</td>
                  <td>{patient.email !== undefined ? patient.email : "N/A"}</td>
                  <td>
                    {patient.lastVisit !== undefined
                      ? patient.lastVisit
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="button small"
                      onClick={() => viewPatientHistory(patient.id)}
                    >
                      Түүх харах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-patients">
            <p>Үйлчлүүлэгч байхгүй байна.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const PatientHistory = ({ patientId }: { patientId: string }) => {
  const { user } = useAuth();
  const [patientHistory, setPatientHistory] = useState<PatientHistoryRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (patientId) {
      fetchPatientHistory(patientId);
    }
  }, [patientId]);

  const fetchPatientHistory = async (id: string) => {
    try {
      // API-аас ирэх өгөгдлийн бүтцэд тааруулж PatientHistoryRecord[] гэж төрөл хувиргана
      const response = (await appointmentsAPI.getByUserId(id)) as {
        data: PatientHistoryRecord[];
      };
      setPatientHistory(response.data);
    } catch (err) {
      setError("Өвчтөний түүхийг авахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    if (!user || !user.id) {
      setError(
        "Тэмдэглэл нэмэхийн тулд хэрэглэгч нэвтэрсэн байх шаардлагатай."
      );
      return;
    }

    try {
      await appointmentsAPI.addPatientNote({
        patientId,
        doctorId: user.id, // user.id нь энд string байх нь баталгаатай болно
        note: newNote,
        advice: "",
        appointmentsNext: "",
        date: new Date().toISOString(),
      });

      fetchPatientHistory(patientId);
      setNewNote("");
      setError(""); // Амжилттай бол алдааг арилгах
    } catch (err) {
      setError("Тэмдэглэл нэмэхэд алдаа гарлаа");
    }
  };

  if (loading) return <div>Ачаалж байна...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="patient-history">
      <h2>Өвчтөний түүх</h2>
      <div className="add-note">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Шинэ тэмдэглэл..."
        />
        <button onClick={addNote}>Нэмэх</button>
      </div>
      <div className="history-list">
        {patientHistory.map((record: PatientHistoryRecord) => (
          <div key={record.id} className="history-item">
            <div className="date">
              {new Date(record.date).toLocaleDateString("mn-MN")}
            </div>
            <div className="note">{record.note}</div>
            {record.doctorName && (
              <div className="doctor">Эмч: {record.doctorName}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
