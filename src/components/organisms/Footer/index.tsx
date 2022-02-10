import Link from "next/link";
import { useContext, useMemo } from "react";
import styles from "./style.module.scss";
import UserContext from "contexts/UserContext";

function Footer(): JSX.Element {
  const { user } = useContext(UserContext);
  const uid = useMemo(() => {
    if (!user) {
      return undefined;
    }

    const { uid } = user;

    return uid;
  }, [user]);

  return (
    <footer className={styles.footer}>
      <p>&copy; 2022 りくばん！</p>
      <div className={styles.linksWrapper}>
        {uid ? (
          <Link href={`/${uid}/report`}>
            <a>運営に連絡する</a>
          </Link>
        ) : null}
        <Link href="/about">
          <a>りくばん！について</a>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
