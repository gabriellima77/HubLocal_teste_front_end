import { InputHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";

import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  label: string;
  name: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, name, ...rest }, ref) => (
    <div className={styles.container} ref={ref}>
      <label htmlFor={name}>{label}</label>
      <input
        style={{ border: error ? "1px solid var(--red)" : "none" }}
        className={styles.input}
        name={name}
        id={name}
        {...rest}
      />
      {error && <span className={styles.error}>{error.message}</span>}
    </div>
  )
);

Input.displayName = "Input";
