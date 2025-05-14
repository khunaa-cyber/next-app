import Image from "next/image";
import Link from "next/link";

export function HeaderWithoutAuth() {
  return (
    <header className="header-no-auth">
      <Link href="/" className="logo">
        <Image src="/logo" alt="Dental Clinic Logo" width={170} height={100} />
      </Link>

      <nav className="navbar">
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
          <li>
            <Link href="/sign">
              <button className="button">Нэвтрэх</button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
