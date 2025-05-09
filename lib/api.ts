// Base API URL
const API_BASE_URL = "/api";

// Type definition for API response
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Helper function to fetch API data with error handling and type safety
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
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

// Reusable request headers function
const getHeaders = (method: string = "GET", body?: any): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (method === "POST" || method === "PUT") {
    return { ...headers, body: JSON.stringify(body) };
  }
  return headers;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      headers: getHeaders("POST", { email, password }),
    });
  },

  register: async (name: string, email: string, password: string) => {
    return fetchAPI("/auth/register", {
      method: "POST",
      headers: getHeaders("POST", { name, email, password }),
    });
  },

  forgotPassword: async (email: string) => {
    return fetchAPI("/auth/forgot-password", {
      method: "POST",
      headers: getHeaders("POST", { email }),
    });
  },
};

// Doctors API
export const doctorsAPI = {
  getAll: async () => {
    const response = await fetchAPI<{ doctors: Doctor[] }>("/doctors");
    return response.data?.doctors;
  },

  getById: async (id: string) => {
    return fetchAPI<Doctor>(`/doctors/${id}`);
  },

  getReviews: async (doctorId: string) => {
    return fetchAPI<Review[]>(`/doctors/${doctorId}/reviews`);
  },

  submitReview: async (doctorId: string, review: Review) => {
    return fetchAPI(`/doctors/${doctorId}/reviews`, {
      method: "POST",
      headers: getHeaders("POST", review),
    });
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const response = await fetchAPI<{ services: Service[] }>("/services");
    return response.data?.services;
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

  create: async (appointment: Appointment) => {
    return fetchAPI("/appointments", {
      method: "POST",
      headers: getHeaders("POST", appointment),
    });
  },

  updateStatus: async (id: number, status: string) => {
    return fetchAPI(`/appointments/${id}`, {
      method: "PUT",
      headers: getHeaders("PUT", { status }),
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
      headers: getHeaders("PUT", profileData),
    });
  },
};

// Feedback API
export const feedbackAPI = {
  submit: async (feedback: Feedback) => {
    return fetchAPI("/feedback", {
      method: "POST",
      headers: getHeaders("POST", feedback),
    });
  },
};

// FAQ API
export const faqAPI = {
  getAll: async () => {
    return fetchAPI<{ faqs: FAQ[] }>("/faq");
  },
};

// Data Models

interface Doctor {
  id: number;
  name: string;
  position: string;
  branch: string;
  experience: string;
  image: string;
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
  service: string;
  date: string;
  time: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

interface Feedback {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  feedbackType: string;
}

interface FAQ {
  question: string;
  answer: string;
}
