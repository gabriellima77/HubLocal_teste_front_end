import { InputHTMLAttributes, forwardRef } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>
(({label, error, name, ...rest}, ref)  => (
    <div ref={ref}>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        id={name}
        {...rest}
      />
      {error &&  <span>{error.message}</span>}
    </div>
));

Input.displayName = 'Input';