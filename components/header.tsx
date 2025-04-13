"use client";
import dynamic from "next/dynamic"

// Import the server-side header
import { HeaderWithoutAuth } from "./header-without-auth"

// Dynamically import the client-side header with no SSR
const ClientHeader = dynamic(() => import("./client-header").then((mod) => ({ default: mod.ClientHeader })), {
  ssr: false,
})

export function Header() {
  return (
    <>
      <HeaderWithoutAuth />
      <ClientHeader />
    </>
  )
}

