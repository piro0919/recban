import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import PwaContext from "contexts/PwaContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import styles from "./style.module.scss";

export type UserMenuProps = {
  imageUrl: string;
  name: string;
  uid: string;
};

function UserMenu({ imageUrl, name, uid }: UserMenuProps): JSX.Element {
  const {
    appinstalled,
    canInstallprompt,
    enabledPwa,
    isPwa,
    showInstallPrompt,
  } = useContext(PwaContext);

  return (
    <div>
      <Menu
        align="end"
        menuButton={
          <MenuButton className={styles.menuButton}>
            <Image
              alt={name}
              height={32}
              layout="fixed"
              src={imageUrl}
              unoptimized={true}
              width={32}
            />
          </MenuButton>
        }
        menuClassName={styles.menu}
        offsetY={8}
        transition={true}
      >
        <MenuItem className={styles.menuItem}>
          <Link href={`/${uid}/articles/new`}>
            <a>メンバーを募集する</a>
          </Link>
        </MenuItem>
        <MenuItem className={styles.menuItem}>
          <Link href={`/${uid}/articles`}>
            <a>募集中の記事を確認する</a>
          </Link>
        </MenuItem>
        <SubMenu
          className={styles.subMenu}
          label="メッセージを確認する"
          menuClassName={styles.menu}
        >
          <MenuItem className={styles.menuItem}>
            <Link href={`/${uid}/messages?article=applicant`}>
              <a>応募中の記事</a>
            </Link>
          </MenuItem>
          <MenuItem className={styles.menuItem}>
            <Link href={`/${uid}/messages?article=recruiter`}>
              <a>募集中の記事</a>
            </Link>
          </MenuItem>
        </SubMenu>
        <MenuItem className={styles.menuItem}>
          <Link href={`/${uid}`}>
            <a>ユーザー情報を確認する</a>
          </Link>
        </MenuItem>
        {!appinstalled && canInstallprompt && enabledPwa && !isPwa ? (
          <MenuItem className={styles.menuItem} onClick={showInstallPrompt}>
            りくばん！をインストールする
          </MenuItem>
        ) : null}
        <MenuItem className={styles.menuItem}>
          <Link href="/signout">
            <a>サインアウトする</a>
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default UserMenu;
