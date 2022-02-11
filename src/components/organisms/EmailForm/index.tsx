import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./style.module.scss";
import Button from "components/atoms/Button";
import HorizontalRule from "components/atoms/HorizontalRule";
import Input from "components/atoms/Input";
import Textarea from "components/atoms/Textarea";
import { useEffect } from "react";

type FieldValues = {
  subject: string;
  text: string;
};

export type EmailFormProps = {
  onSubmit: SubmitHandler<FieldValues>;
};

function EmailForm({ onSubmit }: EmailFormProps): JSX.Element {
  const {
    formState: { isSubmitted, isSubmitting },
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
    if (!isSubmitted) {
      return;
    }

    reset();
  }, [isSubmitted, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formInner}>
        <div className={styles.fieldsWrapper}>
          <Input
            {...register("subject", { required: true })}
            placeholder="件名"
          />
          <HorizontalRule />
          <Textarea
            {...register("text", { required: true })}
            placeholder="本文"
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button disabled={isSubmitting} type="submit">
            送信する
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EmailForm;
