import Link from "next/link";
import styles from "./style.module.scss";

type Message = {
  content: string;
  date: string;
  id: string;
  name: string;
};

export type MessagesTopProps = {
  messages: Message[];
  userId: string;
};

function MessagesTop({ messages, userId }: MessagesTopProps): JSX.Element {
  return (
    <ul>
      {messages.map(({ content, date, id, name }) => (
        <li className={styles.item} key={id}>
          <Link href={`/${userId}/messages/${id}`}>
            <a className={styles.anchor}>
              <div>{name}</div>
              <div>{content}</div>
              <div>{date}</div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default MessagesTop;
