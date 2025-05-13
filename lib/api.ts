// Base API URL
const API_BASE_URL = "/api";

// Helper function to fetch API data with error handling and type safety
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string) => {
    return fetchAPI("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  },

  forgotPassword: async (email: string) => {
    return fetchAPI("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  },
};

// Doctors API
export const doctorsAPI = {
  getAll: async () => {
 return fetchAPI<Doctor[]>(`/doctors`);
  },

  getReviews: async (doctorId: string) => {
    return fetchAPI<Review[]>(`/doctors/${doctorId}/reviews`);
  },

  submitReview: async (doctorId: string, review: Review) => {
    return fetchAPI(`/doctors/${doctorId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    return fetchAPI<Service[]>("/services");
  },

  getById: async (id: number) => {
    return fetchAPI<Service>(`/services/${id}`);
  },
};

// Appointments API
export const appointmentsAPI = {
  getByUserId: async (userId: string) => {
    return fetchAPI<Appointment[]>(`/appointments?userId=${userId}`);
  },

  getById: async (id: number) => {
    return fetchAPI<Appointment>(`/appointments/${id}`);
  },

  create: async (appointment: { userId: string; doctorId: string; date: string; time: string; service: string }) => {
    return fetchAPI("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
  },

  updateStatus: async (id: number, status: string) => {
    return fetchAPI(`/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },

  cancel: async (id: number) => {
    return fetchAPI(`/appointments/${id}`, {
      method: "DELETE",
    });
  },
};

// User API
export const userAPI = {
  getById: async (id: string) => {
    return fetchAPI<User>(`/users/${id}`);
  },

  updateProfile: async (id: string, profileData: any) => {
    return fetchAPI(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
  },
};

// Feedback API
export const feedbackAPI = {
  submit: async (feedback: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    feedbackType: string;
  }) => {
    return fetchAPI("/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
  },
};

// FAQ API
export const faqAPI = {
  getAll: async () => {
    return fetchAPI<FaqItem[]>("/faq");
  },
};

export const newsAPI = {
  getAll: async () => {
    return fetchAPI<{ news: any[] }>("/news");
  },

  getById: async (id: string) => {
    return fetchAPI<any>(`/news/${id}`);
  },  
}

// Define TypeScript interfaces for the API responses
interface Doctor {
  id: string;
  name: string;
  position: string;
  branch: string;
  experience: string;
  education: string;
  specialization: string;
  image: string;
}

interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: string;
}

interface Appointment {
  id: number;
  userId: string;
  doctorId: string;
  date: string;
  time: string;
  status: string;
  service: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}
