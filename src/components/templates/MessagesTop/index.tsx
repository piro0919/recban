import Link from "next/link";
import { useMemo } from "react";
import styles from "./style.module.scss";

type Message = {
  content: string;
  date: string;
  id: string;
  isNew: boolean;
  name: string;
};

export type MessagesTopProps = {
  messages: Message[];
  userId: string;
};

function MessagesTop({ messages, userId }: MessagesTopProps): JSX.Element {
  const items = useMemo(
    () =>
      messages.map(({ content, date, id, isNew, name }) => (
        <li className={styles.item} key={id}>
          <Link href={`/${userId}/messages/${id}`}>
            <a className={`${styles.anchor} ${isNew ? styles.new : ""}`}>
              <div>{name}</div>
              <div className={styles.content}>{content}</div>
              <div className={styles.date}>{date}</div>
            </a>
          </Link>
        </li>
      )),
    [messages, userId]
  );

  return <ul>{items}</ul>;
}

export default MessagesTop;
