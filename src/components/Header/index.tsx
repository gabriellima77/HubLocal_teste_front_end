import Link from "next/link";
import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Header.module.scss";

interface HeaderProps {
  name?: string;
  hasNavLink?: boolean;
}

export function Header({ name, hasNavLink }: HeaderProps) {
  const { signOut } = useContext(AuthContext);
  return (
    <header className={styles.header}>
      <div>Logo</div>
      <p>{name}</p>
      {hasNavLink ? (
        <div>
          <Link href="/empresas" passHref>
            <a href="pass">Empresas</a>
          </Link>
          <Link href="/tickets" passHref>
            <a href="pass">Tickets</a>
          </Link>
        </div>
      ) : null}
      <button className={styles.button} type="button" onClick={() => signOut()}>
        Logout
      </button>
    </header>
  );
}
