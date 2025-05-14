"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authAPI } from "@/lib/api";

// Define types for API responses
type AuthResponse = {
  success: boolean;
  user?: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: "client" | "doctor" | "admin";
  };
  message?: string;
  token?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "doctor" | "admin";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create a default context value with proper types
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

// Initialize the context with the default value
const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    try {
      const storedUser = localStorage.getItem("dental_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const ADMIN_EMAIL = "admin@example.com";
    const ADMIN_PASSWORD = "admin123";

    // Check for admin credentials first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminData: User = {
        id: "admin-1",
        role: "admin",
        name: "Admin User",
        email: ADMIN_EMAIL,
      };
      setUser(adminData);
      localStorage.setItem("dental_user", JSON.stringify(adminData));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("Login attempt for:", email);

    try {
      // Explicitly type the response
      const response = (await authAPI.login(email, password)) as AuthResponse;
      console.log("Login API response:", response);

      // IMPORTANT: Check if login was actually successful
      if (!response.success) {
        console.error("Login failed:", response.message);
        throw new Error(response.message || "Нэвтрэх үйлдэл амжилтгүй боллоо");
      }

      if (!response.user) {
        console.error("Login failed: No user data returned");
        throw new Error("Хэрэглэгчийн мэдээлэл буцаагдсангүй");
      }

      // Ensure the user object has the correct structure
      const userData: User = {
        id: response.user.id || response.user._id || "",
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
      };

      console.log("Setting user data:", userData);
      setUser(userData);
      localStorage.setItem("dental_user", JSON.stringify(userData));

      // Return successfully to allow redirect
      return;
    } catch (error) {
      console.error("Login error:", error);
      setUser(null); // Ensure user is null on login failure
      localStorage.removeItem("dental_user"); // Remove any stored user data
      throw error; // Re-throw the error to be caught by the form
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    console.log("Register attempt for:", email);

    try {
      // Explicitly type the response
      const response = (await authAPI.register(
        name,
        email,
        password
      )) as AuthResponse;
      console.log("Register API response:", response);

      if (!response.success) {
        console.error("Registration failed:", response.message);
        throw new Error(
          response.message || "Бүртгүүлэх үйлдэл амжилтгүй боллоо"
        );
      }

      if (!response.user) {
        console.error("Registration failed: No user data returned");
        throw new Error("Хэрэглэгчийн мэдээлэл буцаагдсангүй");
      }

      // Ensure the user object has the correct structure
      const userData: User = {
        id: response.user.id || response.user._id || "",
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
      };

      console.log("Setting user data:", userData);
      setUser(userData);
      localStorage.setItem("dental_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Registration error:", error);
      setUser(null); // Ensure user is null on registration failure
      localStorage.removeItem("dental_user"); // Remove any stored user data
      throw error; // Re-throw the error to be caught by the form
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("dental_user");
      // Force a page reload to ensure all components update
      window.location.href = "/";
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  };

  // Create the context value object with the current state and functions
  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Export as a named export, not a default export
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
