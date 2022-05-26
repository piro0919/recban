import { Checkbox as PrettyCheckboxReact } from "pretty-checkbox-react";
import { ForwardedRef, forwardRef, ReactNode } from "react";
import { FaCheck } from "react-icons/fa";

export type CheckboxProps = {
  children?: ReactNode;
  value?: string;
};

function Checkbox(
  { children, ...props }: CheckboxProps,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element {
  return (
    <PrettyCheckboxReact
      {...props}
      icon={<FaCheck className="svg" data-type="svg" />}
      ref={ref}
    >
      {children}
    </PrettyCheckboxReact>
  );
}

export default forwardRef<HTMLInputElement, CheckboxProps>(Checkbox);
