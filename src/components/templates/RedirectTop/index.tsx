import { TailSpin } from "react-loader-spinner";
import styles from "./style.module.scss";

function RedirectTop(): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <TailSpin color="#8ab4f8" />
    </div>
  );
}

export default RedirectTop;
