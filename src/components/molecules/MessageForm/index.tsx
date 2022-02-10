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
  const { handleSubmit, register } = useForm<FieldValues>({
    defaultValues: {
      content: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inner}>
        <div className={styles.textareaWrapper}>
          <Textarea
            {...register("content", { required: true })}
            placeholder="メッセージ *"
          />
        </div>
        <button className={styles.button}>
          <GrSend className={styles.icon} />
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
