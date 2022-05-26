import Textarea from "components/atoms/Textarea";
import { Circle } from "rc-progress";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { GrSend } from "react-icons/gr";
import stringLength from "string-length";
import styles from "./style.module.scss";

type FieldValues = {
  content: string;
};

export type MessageFormProps = {
  onSubmit: SubmitHandler<FieldValues>;
};

function MessageForm({ onSubmit }: MessageFormProps): JSX.Element {
  const {
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      content: "",
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
      <div className={styles.inner}>
        <div className={styles.textareaWrapper}>
          <Textarea
            {...register("content", { maxLength: 200, required: true })}
            maxLength={200}
            placeholder="メッセージ *（200文字以内）"
          />
          <Circle
            className={styles.circle}
            percent={(stringLength(watch("content")) / 200) * 100}
            strokeColor="#8ab4f8"
            strokeWidth={12}
            trailColor="#3c4043"
            trailWidth={8}
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
