import styles from './Header.module.scss';


interface HeaderProps {
  name: string;
}

export function Header({ name }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div>Logo</div>
      <p>{name}</p>
      <button>Logout</button>
    </header>
  );
}