import dayjs from "dayjs";
import { useCallback, useRef, useState } from "react";
import Dropdown, { ReactDropdownProps } from "react-dropdown";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./style.module.scss";

export type SelectProps = Pick<
  ReactDropdownProps,
  "onChange" | "options" | "placeholder" | "value"
>;

function Select({
  onChange,
  options,
  placeholder = "",
  value,
}: SelectProps): JSX.Element {
  const [key, setKey] = useState("");
  const ref = useRef(null);
  const handleClickOutside = useCallback(() => {
    setKey(dayjs().format());
  }, []);

  useOnClickOutside(ref, handleClickOutside);

  return (
    <span
      ref={ref}
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
        menuClassName={styles.menu}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        placeholderClassName={styles.placeholder}
        value={value}
      />
    </span>
  );
}

export default Select;
