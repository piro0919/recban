import Heading1 from "components/atoms/Heading1";
import UserMenu from "components/molecules/UserMenu";
import useUser from "hooks/useUser";
import Link from "next/link";
import styles from "./style.module.scss";

function Header(): JSX.Element {
  const { displayName, loading, photoURL, uid } = useUser();

  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Heading1 />
        </a>
      </Link>
      {loading ? null : displayName && photoURL && uid ? (
        <UserMenu imageUrl={photoURL} name={displayName} uid={uid} />
      ) : (
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
