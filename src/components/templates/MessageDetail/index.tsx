import Heading2 from "components/atoms/Heading2";
import HorizontalRule from "components/atoms/HorizontalRule";
import Article from "components/molecules/Article";
import MessageForm, {
  MessageFormProps,
} from "components/molecules/MessageForm";
import Messages, { MessagesProps } from "components/molecules/Messages";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BiLinkExternal } from "react-icons/bi";
import styles from "./style.module.scss";

export type MessageDetailProps = Pick<MessageFormProps, "onSubmit"> &
  Pick<MessagesProps, "isApplicant" | "messages"> & {
    articleId: string;
    collocutorName: string;
  };

function MessageDetail({
  articleId,
  collocutorName,
  isApplicant,
  messages,
  onSubmit,
}: MessageDetailProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollTo(0, ref.current.scrollHeight);
    // メッセージに更新があるたびにスクロールバーを一番下にスクロールさせる
  }, [messages]);

  return (
    <div className={styles.wrapper}>
      <Article
        heading={
          <div className={styles.heading2Wrapper}>
            <Heading2 text={`${collocutorName} さん`} />
            <Link href={`/articles/${articleId}`}>
              <a className={styles.anchor} target="_blank">
                記事を確認する
                <BiLinkExternal />
              </a>
            </Link>
          </div>
        }
        style={{
          alignContent: "flex-start",
          gridTemplate: "auto 1fr/1fr",
          height: "100%",
        }}
      >
        <div className={styles.inner}>
          <HorizontalRule />
          <div className={styles.inner2}>
            <div className={styles.messagesWrapper} ref={ref}>
              <div className={styles.messages2Wrapper}>
                <Messages isApplicant={isApplicant} messages={messages} />
              </div>
            </div>
            <MessageForm onSubmit={onSubmit} />
          </div>
        </div>
      </Article>
    </div>
  );
}

export default MessageDetail;
