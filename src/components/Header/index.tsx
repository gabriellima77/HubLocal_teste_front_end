import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Header.module.scss";

interface HeaderProps {
  name?: string;
}

export function Header({ name }: HeaderProps) {
  const { signOut } = useContext(AuthContext);
  return (
    <header className={styles.header}>
      <div>Logo</div>
      <p>{name}</p>
      <button type="button" onClick={() => signOut()}>
        Logout
      </button>
    </header>
  );
}
