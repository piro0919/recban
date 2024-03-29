import Button, { ButtonProps } from "components/atoms/Button";
import Heading2 from "components/atoms/Heading2";
import Heading3 from "components/atoms/Heading3";
import HorizontalRule from "components/atoms/HorizontalRule";
import Article from "components/molecules/Article";
import DefinitionList from "components/molecules/DefinitionList";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { TwitterShareButton } from "react-share";
import styles from "./style.module.scss";

export type MyArticleDetailProps = {
  age: string;
  ambition: string;
  articleId: string;
  content: string;
  frequency: string;
  fromDate: string;
  genre: string;
  onDelete: ButtonProps["onClick"];
  part: string;
  place: string;
  sex: string;
  title: string;
  twitterId: string;
  uid: string;
  untilDate: string;
};

function MyArticleDetail({
  age,
  ambition,
  articleId,
  content,
  frequency,
  fromDate,
  genre,
  onDelete,
  part,
  place,
  sex,
  title,
  twitterId,
  uid,
  untilDate,
}: MyArticleDetailProps): JSX.Element {
  const router = useRouter();
  const handleConfirm = useCallback<NonNullable<ButtonProps["onClick"]>>(() => {
    router.push(`/articles/${articleId}`);
  }, [articleId, router]);
  const handleEdit = useCallback<NonNullable<ButtonProps["onClick"]>>(() => {
    router.push(`/${uid}/articles/${articleId}/edit`);
  }, [articleId, router, uid]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

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
                ]}
              />
            </div>
          </Article>
          <HorizontalRule />
          <div className={styles.inner2}>
            <div className={styles.buttonsWrapper}>
              <Button onClick={handleConfirm}>記事を確認する</Button>
              <Button onClick={handleEdit}>記事を修正する</Button>
              <Button onClick={onDelete}>募集を終了する</Button>
              {origin ? (
                <TwitterShareButton
                  className={styles.twitterShareButton}
                  hashtags={["りくばん！"]}
                  title={title}
                  url={`${origin}/articles/${articleId}`}
                  via={twitterId}
                >
                  Twitterでシェアする
                </TwitterShareButton>
              ) : null}
            </div>
          </div>
        </div>
      </Article>
    </div>
  );
}

export default MyArticleDetail;
