"use client";

import type React from "react";

import { AuthProvider } from "../context/auth-context";

export function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
