import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/atoms/Button";
import Checkbox from "components/atoms/Checkbox";
import HorizontalRule from "components/atoms/HorizontalRule";
import Input from "components/atoms/Input";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcInfo } from "react-icons/fc";
import * as yup from "yup";
import styles from "./style.module.scss";

type FieldValues = {
  email: string;
  enabledContactEmail: boolean;
  name: string;
  notification: boolean;
  twitterId: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email("メールアドレスの形式で入力してください")
      .when("enabledContactEmail", {
        is: true,
        then: yup
          .string()
          .required("メールで連絡したい場合、メールアドレスを入力してください"),
      })
      .when("notification", {
        is: true,
        then: yup
          .string()
          .required(
            "メールで通知を受け取りたい場合、メールアドレスを入力してください"
          ),
      }),
    name: yup.string().required("お名前 / ハンドルネームを入力してください"),
  })
  .required();

export type ProfileFormProps = {
  defaultValues: FieldValues;
  isNew: boolean;
  onSubmit: SubmitHandler<FieldValues>;
};

function ProfileForm({
  defaultValues,
  isNew,
  onSubmit,
}: ProfileFormProps): JSX.Element {
  const {
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<FieldValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const handleEnabledContactEmail = useCallback(() => {
    toast("メールによる募集および応募が可能になります");
  }, []);
  const handleNotification = useCallback(() => {
    toast("メッセージが届いた際にメールが届きます");
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formInner}>
        <div className={styles.fieldsWrapper}>
          <div className={styles.fieldWrapper2}>
            <label className={`${styles.label} ${styles.inputLabel}`}>
              <span>
                お名前 / ハンドルネーム
                <abbr className={styles.required}>*</abbr>
              </span>
              <Input {...register("name")} />
            </label>
            <p className={styles.error}>{errors.name?.message}</p>
          </div>
          <div className={styles.fieldWrapper2}>
            <label className={`${styles.label} ${styles.inputLabel}`}>
              <span>メールアドレス</span>
              <Input {...register("email")} type="email" />
            </label>
            <p className={styles.error}>{errors.email?.message}</p>
          </div>
          <label className={`${styles.label} ${styles.inputLabel}`}>
            <span>TwitterID</span>
            <Input {...register("twitterId")} />
          </label>
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>
              <span>
                メールで連絡可能<abbr className={styles.required}>*</abbr>
              </span>
              <Checkbox {...register("enabledContactEmail")} />
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
              <Checkbox {...register("notification")} />
            </label>
            <button onClick={handleNotification} type="button">
              <FcInfo />
            </button>
          </div>
        </div>
        <HorizontalRule />
        <div className={styles.buttonWrapper}>
          <Button disabled={!isDirty || isSubmitting} type="submit">
            {isNew ? "作成する" : "修正する"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ProfileForm;
