interface ButtonProps {
  children: string;
}

export function Button({children}: ButtonProps) {
  return (
    <button type="submit">
      {children}
    </button>
  )
}