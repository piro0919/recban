import Ellipsis, { EllipsisProps } from "react-ellipsis-pjs";
import { useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type Heading2Props = Pick<EllipsisProps, "text">;

function Heading2({ text }: Heading2Props): JSX.Element {
  const { width } = useWindowSize();

  return (
    <h2 className={styles.heading2}>
      <Ellipsis key={width} lines={2} text={text} />
    </h2>
  );
}

export default Heading2;
