import { ReactNode } from "react";
import styles from "./style.module.scss";

export type Heading2Props = {
  children: ReactNode;
};

function Heading3({ children }: Heading2Props): JSX.Element {
  return <h3 className={styles.heading3}>{children}</h3>;
}

export default Heading3;
