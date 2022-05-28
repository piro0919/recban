import {
  FocusEventHandler,
  ChangeEventHandler,
  forwardRef,
  ForwardedRef,
  CSSProperties,
} from "react";
import styles from "./style.module.scss";

export type TextareaProps = {
  maxLength?: number;
  name?: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  style?: CSSProperties;
  value?: string;
};

function Textarea(
  {
    maxLength,
    name,
    onBlur,
    onChange,
    placeholder,
    style,
    value,
  }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
): JSX.Element {
  return (
    <textarea
      className={styles.textarea}
      maxLength={maxLength}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
      ref={ref}
      style={style}
      value={value}
    />
  );
}

export default forwardRef<HTMLTextAreaElement, TextareaProps>(Textarea);
