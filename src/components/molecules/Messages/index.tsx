import dayjs from "dayjs";
import { Fragment } from "react";
import styles from "./style.module.scss";

type Message = {
  content: string;
  date: string;
  user: "applicant" | "recruiter";
};

export type MessagesProps = {
  isApplicant: boolean;
  messages: Message[];
};

function Messages({ isApplicant, messages }: MessagesProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      {messages.map(({ content, date, user }, index) => (
        <Fragment key={`${content}${date}`}>
          {index === 0 ||
          !dayjs(date).isSame(messages[index - 1].date, "date") ? (
            <div className={styles.dateWrapper}>
              {dayjs(date).format("YYYY.MM.DD（ddd）")}
            </div>
          ) : null}
          <div
            className={
              (isApplicant && user === "applicant") ||
              (!isApplicant && user === "recruiter")
                ? styles.senderWrapper
                : styles.receiverWrapper
            }
          >
            <div className={styles.dateWrapper2}>
              {dayjs(date).format("HH:mm")}
            </div>
            <p className={styles.message}>{content}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default Messages;
