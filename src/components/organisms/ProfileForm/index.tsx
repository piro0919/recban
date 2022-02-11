import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FcInfo } from "react-icons/fc";
import swal from "sweetalert";
import styles from "./style.module.scss";
import Button from "components/atoms/Button";
import HorizontalRule from "components/atoms/HorizontalRule";
import Input from "components/atoms/Input";

type FieldValues = {
  email: string;
  enabledContactEmail: boolean;
  name: string;
  notification: boolean;
  twitterId: string;
};

export type ProfileFormProps = {
  defaultValues?: FieldValues;
  onSubmit: SubmitHandler<FieldValues>;
};

function ProfileForm({
  defaultValues,
  onSubmit,
}: ProfileFormProps): JSX.Element {
  const { handleSubmit, register } = useForm<FieldValues>({
    defaultValues: defaultValues || {
      email: "",
      enabledContactEmail: false,
      name: "",
      notification: false,
      twitterId: "",
    },
  });
  const handleEnabledContactEmail = useCallback(async () => {
    await swal({
      icon: "info",
      text: "メールによる募集および応募ができるようになります",
      title: "メールで連絡可能",
    });
  }, []);
  const handleNotification = useCallback(async () => {
    await swal({
      icon: "info",
      text: "メッセージが届いた際にメールが届きます",
      title: "メール通知",
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formInner}>
        <div className={styles.fieldsWrapper}>
          <label className={styles.label}>
            <span>
              お名前 / ハンドルネーム<abbr className={styles.required}>*</abbr>
            </span>
            <Input {...register("name", { required: true })} />
          </label>
          <label className={styles.label}>
            <span>メールアドレス</span>
            <Input {...register("email")} type="email" />
          </label>
          <label className={styles.label}>
            <span>TwitterID</span>
            <Input {...register("twitterId")} />
          </label>
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>
              <span>
                メールで連絡可能<abbr className={styles.required}>*</abbr>
              </span>
              <input {...register("enabledContactEmail")} type="checkbox" />
            </label>
            <button onClick={handleEnabledContactEmail} type="button">
              <FcInfo />
            </button>
          </div>
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>
              <span>
                メール通知<abbr className={styles.required}>*</abbr>
              </span>
              <input {...register("notification")} type="checkbox" />
            </label>
            <button onClick={handleNotification} type="button">
              <FcInfo />
            </button>
          </div>
        </div>
        <HorizontalRule />
        <div className={styles.buttonWrapper}>
          <Button type="submit">
            {defaultValues ? "修正する" : "作成する"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ProfileForm;
