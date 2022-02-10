import Link from "next/link";
import styles from "./style.module.scss";

function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2022 りくばん！</p>
      <Link href="/about">
        <a>りくばん！について</a>
      </Link>
    </footer>
  );
}

export default Footer;
