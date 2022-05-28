import Button from "components/atoms/Button";
import HorizontalRule from "components/atoms/HorizontalRule";
import Input from "components/atoms/Input";
import Textarea from "components/atoms/Textarea";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./style.module.scss";

type FieldValues = {
  subject: string;
  text: string;
};

export type EmailFormProps = {
  disabled?: boolean;
  onSubmit: SubmitHandler<FieldValues>;
};

function EmailForm({
  disabled = false,
  onSubmit,
}: EmailFormProps): JSX.Element {
  const {
    formState: { isDirty, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      subject: "",
      text: "",
    },
  });

  useEffect(() => {
    if (!isSubmitSuccessful) {
      return;
    }

    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formInner}>
        <div className={styles.fieldsWrapper}>
          <Input
            {...register("subject", { required: true })}
            placeholder="件名 *"
          />
          <HorizontalRule />
          <Textarea
            {...register("text", { required: true })}
            placeholder="本文 *"
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button disabled={disabled || !isDirty || isSubmitting} type="submit">
            送信する
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EmailForm;
