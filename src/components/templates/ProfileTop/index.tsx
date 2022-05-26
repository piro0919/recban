import Button, { ButtonProps } from "components/atoms/Button";
import HorizontalRule from "components/atoms/HorizontalRule";
import DefinitionList from "components/molecules/DefinitionList";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "./style.module.scss";

export type ProfileTopProps = {
  email: string;
  enabledContactEmail: boolean;
  name: string;
  notification: boolean;
  twitterId: string;
  uid: string;
};

function ProfileTop({
  email,
  enabledContactEmail,
  name,
  notification,
  twitterId,
  uid,
}: ProfileTopProps): JSX.Element {
  const router = useRouter();
  const handleEdit = useCallback<NonNullable<ButtonProps["onClick"]>>(() => {
    router.push(`/${uid}/edit`);
  }, [router, uid]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <DefinitionList
          definitions={[
            {
              description: name || "未設定",
              term: "お名前 / ハンドルネーム",
            },
            {
              description: email || "未設定",
              term: "メールアドレス",
            },
            {
              description: twitterId || "未設定",
              term: "TwitterID",
            },
            {
              description: enabledContactEmail ? "オン" : "オフ",
              term: "メールで連絡可能",
            },
            {
              description: notification ? "オン" : "オフ",
              term: "メール通知",
            },
          ]}
        />
      </div>
      <HorizontalRule />
      <div className={styles.buttonWrapper}>
        <Button onClick={handleEdit}>修正する</Button>
      </div>
    </div>
  );
}

export default ProfileTop;
