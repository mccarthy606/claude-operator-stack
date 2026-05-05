import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import styles from "./input.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const cls = [styles.input, className].filter(Boolean).join(" ");

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input id={inputId} className={cls} {...rest} />
    </div>
  );
}
