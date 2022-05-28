import dayjs from "dayjs";
import { ForwardedRef, forwardRef, useCallback, useRef, useState } from "react";
import Dropdown, { ReactDropdownProps } from "react-dropdown";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./style.module.scss";

export type SelectProps = Pick<
  ReactDropdownProps,
  "onChange" | "options" | "placeholder" | "value"
> & {
  isDisplayAbove?: boolean;
};

function Select(
  { isDisplayAbove, onChange, options, placeholder = "", value }: SelectProps,
  ref: ForwardedRef<Dropdown>
): JSX.Element {
  const [key, setKey] = useState("");
  const wrapperRef = useRef(null);
  const handleClickOutside = useCallback(() => {
    setKey(dayjs().format());
  }, []);

  useOnClickOutside(wrapperRef, handleClickOutside);

  return (
    <span
      ref={wrapperRef}
      style={{
        minWidth: `calc(${Math.max(
          ...[...options, placeholder].map(
            (option) => (option as string).length
          )
        )} * (1.4rem + 1px) + 42px)`,
      }}
    >
      <Dropdown
        arrowClassName={styles.arrow}
        controlClassName={styles.control}
        key={key}
        menuClassName={`${styles.menu} ${isDisplayAbove ? styles.above : ""}`}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        placeholderClassName={styles.placeholder}
        ref={ref}
        value={value}
      />
    </span>
  );
}

export default forwardRef<Dropdown, SelectProps>(Select);
