import {
  FocusEventHandler,
  ChangeEventHandler,
  forwardRef,
  ForwardedRef,
  ReactNode,
  useMemo,
} from "react";
import styles from "./style.module.scss";

type Option = {
  label: ReactNode;
  value: string;
};

export type SelectProps = {
  name?: string;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  options: Option[];
  value?: string;
};

function Select(
  { name, onBlur, onChange, options, value }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>
): JSX.Element {
  const items = useMemo(
    () =>
      options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      )),
    [options]
  );

  return (
    <select
      className={styles.select}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      ref={ref}
      value={value}
    >
      {items}
    </select>
  );
}

export default forwardRef<HTMLSelectElement, SelectProps>(Select);
