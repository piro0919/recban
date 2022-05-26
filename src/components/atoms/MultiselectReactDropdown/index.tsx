import Multiselect from "multiselect-react-dropdown";
import { IMultiselectProps } from "multiselect-react-dropdown/dist/multiselect/interface";
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
  props: MultiselectReactDropdownProps
): JSX.Element {
  return (
    <Multiselect
      {...props}
      avoidHighlightFirstOption={true}
      className={styles.multiselect}
      emptyRecordMsg="入力された文字列に一致する結果は見つかりませんでした"
    />
  );
}

export default MultiselectReactDropdown;
