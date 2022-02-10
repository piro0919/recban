import { ReactNode } from "react";
import styles from "./style.module.scss";

export type Heading2Props = {
  children: ReactNode;
};

function Heading2({ children }: Heading2Props): JSX.Element {
  return <h2 className={styles.heading2}>{children}</h2>;
}

export default Heading2;
