export interface Patient {
  id: string;
  name: string;
  age?: number;
  phone?: string;
  email?: string;
  lastVisit?: string;
}

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  service: string;
  status: "Товлосон" | "Дууссан" | "Цуцалсан" | string;
  date: string;
}

// PatientsSection.tsx доторх PatientHistoryRecord-г энд нэгтгэж болно
export interface PatientHistoryRecord {
  id: string;
  date: string;
  note: string;
  doctorName?: string;
  // appointmentsAPI.addPatientNote-д ашиглагдаж буй бусад талбарууд
  advice?: string;
  appointmentsNext?: string;
  patientId?: string; // Хэрэв API эсвэл логикт хэрэгтэй бол
  doctorId?: string; // Хэрэв API эсвэл логикт хэрэгтэй бол
}
