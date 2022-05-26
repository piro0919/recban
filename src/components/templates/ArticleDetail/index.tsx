import Button, { ButtonProps } from "components/atoms/Button";
import Heading2 from "components/atoms/Heading2";
import Heading3 from "components/atoms/Heading3";
import HorizontalRule from "components/atoms/HorizontalRule";
import Article from "components/molecules/Article";
import DefinitionList from "components/molecules/DefinitionList";
import useUser from "hooks/useUser";
import Link from "next/link";
import { useCallback } from "react";
import styles from "./style.module.scss";

export type ArticleDetailProps = {
  age: string;
  ambition: string;
  content: string;
  frequency: string;
  fromDate: string;
  genre: string;
  part: string;
  place: string;
  sex: string;
  title: string;
  uid: string;
  untilDate: string;
} & (
  | {
      disabledEmail: boolean;
      isSignIn: true;
      name: string;
      onSendMessage: ButtonProps["onClick"];
      onTransitionEmail: ButtonProps["onClick"];
      twitterId: string;
    }
  | {
      isSignIn: false;
    }
);

function ArticleDetail({
  age,
  ambition,
  content,
  frequency,
  fromDate,
  genre,
  part,
  place,
  sex,
  title,
  uid,
  untilDate,
  ...props
}: ArticleDetailProps): JSX.Element {
  const handleTransitionTwitter = useCallback<
    NonNullable<ButtonProps["onClick"]>
  >(() => {
    if (!props.isSignIn || !props.twitterId) {
      return;
    }

    window.open(`https://twitter.com/${props.twitterId}`, "_blank");
  }, [props]);
  const { loading, uid: userUid } = useUser();

  return (
    <div className={styles.wrapper}>
      <Article
        heading={
          <div className={styles.heading2Wrapper}>
            <Heading2 text={title} />
          </div>
        }
      >
        <div className={styles.inner}>
          <div className={styles.inner2}>
            <p
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br />"),
              }}
            />
          </div>
          <HorizontalRule />
          <Article
            heading={
              <div className={styles.inner2}>
                <Heading3>概要</Heading3>
              </div>
            }
          >
            <div className={styles.inner2}>
              <DefinitionList
                definitions={[
                  {
                    description: part,
                    term: "募集パート",
                  },
                  {
                    description: genre,
                    term: "ジャンル",
                  },
                  {
                    description: sex,
                    term: "性別",
                  },
                  {
                    description: age,
                    term: "年齢",
                  },
                  {
                    description: place,
                    term: "活動場所",
                  },
                  {
                    description: frequency,
                    term: "活動頻度",
                  },
                  {
                    description: ambition,
                    term: "志向性",
                  },
                  {
                    description: fromDate,
                    term: "募集開始日",
                  },
                  {
                    description: untilDate,
                    term: "掲載終了日",
                  },
                  {
                    description: props.isSignIn ? (
                      `${props.name} さん`
                    ) : (
                      <p>
                        <Link href="/signin">
                          <a className={styles.anchor}>サインイン</a>
                        </Link>
                        すると表示されます
                      </p>
                    ),
                    term: "募集者名",
                  },
                ]}
              />
            </div>
          </Article>
          {loading || uid === userUid ? null : (
            <>
              <HorizontalRule />
              {props.isSignIn ? (
                <div className={`${styles.buttonsWrapper} ${styles.inner2}`}>
                  <Button
                    disabled={props.disabledEmail}
                    onClick={props.onTransitionEmail}
                  >
                    メールを送信する
                  </Button>
                  <Button
                    disabled={!props.twitterId}
                    onClick={handleTransitionTwitter}
                  >
                    Twitterから連絡する
                  </Button>
                  <Button onClick={props.onSendMessage}>
                    メッセージを送信する
                  </Button>
                </div>
              ) : (
                <div className={styles.inner2}>
                  <p>
                    <Link href="/signin">
                      <a className={styles.anchor}>サインイン</a>
                    </Link>
                    すると連絡可能になります
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Article>
    </div>
  );
}

export default ArticleDetail;
