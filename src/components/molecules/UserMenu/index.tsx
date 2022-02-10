import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

export type UserMenuProps = {
  imageUrl: string;
  name: string;
  userId: string;
};

function UserMenu({ imageUrl, name, userId }: UserMenuProps): JSX.Element {
  return (
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
        <Link href={`/${userId}/articles/new`}>
          <a>メンバーを募集する</a>
        </Link>
      </MenuItem>
      <MenuItem className={styles.menuItem}>
        <Link href={`/${userId}/articles`}>
          <a>募集中の記事を確認する</a>
        </Link>
      </MenuItem>
      <MenuItem className={styles.menuItem}>
        <Link href={`/${userId}/messages`}>
          <a>メッセージを確認する</a>
        </Link>
      </MenuItem>
      <MenuItem className={styles.menuItem}>
        <Link href={`/${userId}`}>
          <a>ユーザー情報を確認する</a>
        </Link>
      </MenuItem>
      {/* <MenuItem className={styles.menuItem}>
        りくばん！をインストールする
      </MenuItem> */}
      <MenuItem className={styles.menuItem}>
        <Link href="/signout">
          <a>サインアウトする</a>
        </Link>
      </MenuItem>
    </Menu>
  );
}

export default UserMenu;
