import {
  FocusEventHandler,
  ChangeEventHandler,
  forwardRef,
  ForwardedRef,
} from "react";
import styles from "./style.module.scss";

export type InputProps = {
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: "email" | "text";
  value?: string;
};

function Input(
  { name, onBlur, onChange, placeholder, type = "text", value }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element {
  return (
    <input
      className={styles.input}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
      ref={ref}
      style={{
        minWidth:
          placeholder && `calc(${placeholder.length} * (1.4rem + 1px) + 28px)`,
      }}
      type={type}
      value={value}
    />
  );
}

export default forwardRef<HTMLInputElement, InputProps>(Input);
