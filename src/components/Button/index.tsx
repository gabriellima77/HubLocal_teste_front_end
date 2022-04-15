import styles from './Button.module.scss';

interface ButtonProps {
  children: string;
}

export function Button({children}: ButtonProps) {
  return (
    <button className={styles.button} type="submit">
      <p>{children}</p>
    </button>
  )
}