import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import swal from "sweetalert";
import usePwa from "use-pwa";
import styles from "./style.module.scss";

export type UserMenuProps = {
  imageUrl: string;
  name: string;
  userId: string;
};

function UserMenu({ imageUrl, name, userId }: UserMenuProps): JSX.Element {
  const {
    appinstalled,
    canInstallprompt,
    enabledPwa,
    enabledUpdate,
    isPwa,
    showInstallPrompt,
    unregister,
  } = usePwa();
  const handleUpdate = useCallback(async () => {
    const result = await unregister();

    if (result) {
      await swal({
        icon: "success",
        text: "アップデートが完了しました\n再読み込みを行います",
        title: "りくばん！のアップデート",
      });

      window.location.reload();

      return;
    }
  }, [unregister]);

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
        {enabledPwa && !isPwa && canInstallprompt && !appinstalled ? (
          <MenuItem className={styles.menuItem} onClick={showInstallPrompt}>
            りくばん！をインストールする
          </MenuItem>
        ) : null}
        {enabledUpdate && isPwa ? (
          <MenuItem className={styles.menuItem} onClick={handleUpdate}>
            りくばん！をアップデートする
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
