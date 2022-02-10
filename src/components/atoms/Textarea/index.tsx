import {
  FocusEventHandler,
  ChangeEventHandler,
  forwardRef,
  ForwardedRef,
} from "react";
import styles from "./style.module.scss";

export type TextareaProps = {
  name?: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  value?: string;
};

function Textarea(
  { name, onBlur, onChange, placeholder, value }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
): JSX.Element {
  return (
    <textarea
      className={styles.textarea}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
      ref={ref}
      value={value}
    />
  );
}

export default forwardRef<HTMLTextAreaElement, TextareaProps>(Textarea);
