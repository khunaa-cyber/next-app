"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/auth-context";

export function HeaderWithAuth() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={isScrolled ? "header-active" : ""}>
      <Link href="/" className="logo">
        <Image
          src="logo.png"
          alt="Dental Clinic Logo"
          width={170}
          height={100}
        />
      </Link>

      <nav className={`navbar ${isMenuOpen ? "nav-toggle" : ""}`}>
        <ul>
          <li>
            <Link href="/">Нүүр хуудас</Link>
          </li>
          <li>
            <Link href="/services">Үйлчилгээ</Link>
          </li>
          <li>
            <Link href="/doctors">Эмч нар</Link>
          </li>
          <li>
            <Link href="/blog">Мэдээ мэдээлэл</Link>
          </li>
          <li>
            <Link href="/book-online">Цаг захиалах</Link>
          </li>

          {user ? (
            <>
              {user.role === "client" && (
                <li>
                  <Link href="/my-history">Миний түүх</Link>
                </li>
              )}
              {user.role === "doctor" && (
                <li>
                  <Link href="/doctor-dashboard">Эмчийн хэсэг</Link>
                </li>
              )}
              {user.role === "admin" && (
                <li>
                  <Link href="/admin-dashboard">Админ</Link>
                </li>
              )}
              <li>
                <button className="button" onClick={logout}>
                  Гарах
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/sign">
                <button className="button">Нэвтрэх</button>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div
        className={`fa-solid fa-bars ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      ></div>
    </header>
  );
}
