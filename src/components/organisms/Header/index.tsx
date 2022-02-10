import Link from "next/link";
import { useContext, useMemo } from "react";
import styles from "./style.module.scss";
import UserMenu from "components/molecules/UserMenu";
import UserContext from "contexts/UserContext";

export type HeaderProps = {
  hideRecruit?: boolean;
};

function Header({ hideRecruit = false }: HeaderProps): JSX.Element {
  const { user } = useContext(UserContext);
  const { displayName, photoURL, uid } = useMemo(() => {
    if (!user) {
      return { displayName: "", photoURL: "", uid: "" };
    }

    const { displayName, photoURL, uid } = user;

    return {
      uid,
      displayName: displayName || "",
      photoURL: photoURL || "",
    };
  }, [user]);

  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <h1 className={styles.heading1}>りくばん！</h1>
        </a>
      </Link>
      {photoURL ? (
        <UserMenu imageUrl={photoURL} name={displayName} userId={uid} />
      ) : hideRecruit ? null : (
        <p className={styles.recruit}>
          <span>メンバーを募集したい方は</span>
          <span>
            <Link href="/signin">
              <a className={styles.anchor}>サインイン</a>
            </Link>
            してください
          </span>
        </p>
      )}
    </header>
  );
}

export default Header;
