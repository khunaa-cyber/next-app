// Base API URL
const API_BASE_URL = "/api"

// Define response types
export type AuthResponse = {
  success: boolean
  user?: {
    _id?: string
    id?: string
    name: string
    email: string
    role: "client" | "doctor" | "admin"
  }
  message?: string
  token?: string
}

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`API Request: ${endpoint}`, options?.method || "GET")
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    console.log(`API Response status: ${response.status}`)

    // Check if the response is empty
    const contentType = response.headers.get("content-type")
    let data: any = {}

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      console.log("Response is not JSON")
      // For non-JSON responses (like 204 No Content)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return {} as T
    }

    // IMPORTANT: Don't throw an error here, return the response with success: false
    // This allows the auth context to handle the error properly
    return data as T
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log("authAPI.login called with email:", email)
    try {
      const response = await fetchAPI<AuthResponse>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response:", response)
      return response
    } catch (error) {
      console.error("Login error:", error)
      // Return a failed response instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      }
    }
  },

  register: async (name: string, email: string, password: string, role = "client"): Promise<AuthResponse> => {
    console.log("authAPI.register called with email:", email, "and role:", role)
    try {
      const response = await fetchAPI<AuthResponse>("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      console.log("Register response:", response)
      return response
    } catch (error) {
      console.error("Register error:", error)
      // Return a failed response instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      }
    }
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    return fetchAPI<AuthResponse>("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
  },
}

// Doctors API
export const doctorsAPI = {
  getAll: async () => {
    return fetchAPI("/doctors")
  },

  getById: async (id: string) => {
    return fetchAPI(`/doctors/${id}`)
  },

  getReviews: async (doctorId: string) => {
    return fetchAPI(`/doctors/${doctorId}/reviews`)
  },

  submitReview: async (
    doctorId: string,
    review: { userId: string; userName: string; rating: number; comment: string },
  ) => {
    return fetchAPI(`/doctors/${doctorId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    })
  },
}

// Services API
export const servicesAPI = {
  getAll: async () => {
    return fetchAPI("/services")
  },

  getById: async (id: number) => {
    return fetchAPI(`/services/${id}`)
  },
}

// Appointments API
export const appointmentsAPI = {
  getByUserId: async (userId: string) => {
    return fetchAPI(`/appointments?userId=${userId}`)
  },

  getById: async (id: number) => {
    return fetchAPI(`/appointments/${id}`)
  },

  create: async (appointment: { userId: string; doctorId: string; date: string; time: string; service: string }) => {
    return fetchAPI("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    })
  },

  updateStatus: async (id: number, status: string) => {
    return fetchAPI(`/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  },

  cancel: async (id: number) => {
    return fetchAPI(`/appointments/${id}`, {
      method: "DELETE",
    })
  },
}

// User API
export const userAPI = {
  getById: async (id: string) => {
    return fetchAPI(`/users/${id}`)
  },

  updateProfile: async (id: string, profileData: any) => {
    return fetchAPI(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    })
  },
}

// Feedback API
export const feedbackAPI = {
  submit: async (feedback: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    feedbackType: string
  }) => {
    return fetchAPI("/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    })
  },
}

// FAQ API
export const faqAPI = {
  getAll: async () => {
    return fetchAPI("/faq")
  },
}

export const newsAPI = {
  getAll: async () => {
    return fetchAPI("/news")
  },

  getById: async (id: string) => {
    return fetchAPI(`/news/${id}`)
  },

  create: async (newsData: {
    title: string
    content: string
    image: string
    description: string
    category?: string
  }) => {
    return fetchAPI("/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newsData),
    })
  },

  update: async (id: string, newsData: any) => {
    return fetchAPI(`/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newsData),
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/news/${id}`, {
      method: "DELETE",
    })
  },
}