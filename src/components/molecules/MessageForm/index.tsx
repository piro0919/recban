import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { GrSend } from "react-icons/gr";
import styles from "./style.module.scss";
import Textarea from "components/atoms/Textarea";

type FieldValues = {
  content: string;
};

export type MessageFormProps = {
  onSubmit: SubmitHandler<FieldValues>;
};

function MessageForm({ onSubmit }: MessageFormProps): JSX.Element {
  const {
    formState: { isSubmitted, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      content: "",
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
      <div className={styles.inner}>
        <div className={styles.textareaWrapper}>
          <Textarea
            {...register("content", { required: true })}
            placeholder="メッセージ *"
          />
        </div>
        <button className={styles.button} disabled={isSubmitting}>
          <GrSend className={styles.icon} />
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
