import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "./style.module.scss";
import Button, { ButtonProps } from "components/atoms/Button";
import HorizontalRule from "components/atoms/HorizontalRule";
import DefinitionList from "components/molecules/DefinitionList";

export type ProfileTopProps = {
  email: string;
  enabledContactEmail: string;
  name: string;
  notification: string;
  twitterId: string;
  userId: string;
};

function ProfileTop({
  email,
  enabledContactEmail,
  name,
  notification,
  twitterId,
  userId,
}: ProfileTopProps): JSX.Element {
  const router = useRouter();
  const handleEdit = useCallback<NonNullable<ButtonProps["onClick"]>>(() => {
    router.push(`/${userId}/edit`);
  }, [router, userId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <DefinitionList
          definitions={[
            {
              description: name,
              term: "お名前 / ハンドルネーム",
            },
            {
              description: email,
              term: "メールアドレス",
            },
            {
              description: twitterId,
              term: "TwitterID",
            },
            {
              description: enabledContactEmail,
              term: "メールで連絡可能",
            },
            {
              description: notification,
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
