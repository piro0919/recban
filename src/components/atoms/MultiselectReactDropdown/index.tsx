import dayjs from "dayjs";
import Multiselect from "multiselect-react-dropdown";
import { IMultiselectProps } from "multiselect-react-dropdown/dist/multiselect/interface";
import { ForwardedRef, forwardRef, useState } from "react";
import styles from "./style.module.scss";

export type MultiselectReactDropdownProps = Pick<
  IMultiselectProps,
  | "displayValue"
  | "groupBy"
  | "isObject"
  | "onRemove"
  | "onSelect"
  | "options"
  | "placeholder"
  | "selectedValues"
  | "selectionLimit"
>;

function MultiselectReactDropdown(
  {
    displayValue,
    groupBy,
    isObject,
    onRemove,
    onSelect,
    options,
    placeholder,
    selectedValues,
    selectionLimit,
  }: MultiselectReactDropdownProps,
  ref: ForwardedRef<Multiselect>
): JSX.Element {
  const [key, setKey] = useState("");

  return (
    <Multiselect
      avoidHighlightFirstOption={true}
      className={styles.multiselect}
      displayValue={displayValue}
      emptyRecordMsg="入力された文字列に一致する結果は見つかりませんでした"
      groupBy={groupBy}
      isObject={isObject}
      key={key}
      onRemove={onRemove}
      onSelect={(selectedList, selectedItem): void => {
        if (!onSelect) {
          return;
        }

        onSelect(selectedList, selectedItem);

        setKey(dayjs().format());
      }}
      options={options}
      placeholder={placeholder}
      ref={ref}
      selectedValues={selectedValues}
      selectionLimit={selectionLimit}
    />
  );
}

export default forwardRef<Multiselect, MultiselectReactDropdownProps>(
  MultiselectReactDropdown
);
