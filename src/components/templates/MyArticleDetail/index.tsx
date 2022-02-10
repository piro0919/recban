import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "./style.module.scss";
import Button, { ButtonProps } from "components/atoms/Button";
import Heading2 from "components/atoms/Heading2";
import Heading3 from "components/atoms/Heading3";
import HorizontalRule from "components/atoms/HorizontalRule";
import Article from "components/molecules/Article";
import DefinitionList from "components/molecules/DefinitionList";

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
  untilDate: string;
  userId: string;
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
  untilDate,
  userId,
}: MyArticleDetailProps): JSX.Element {
  const router = useRouter();
  const handleConfirm = useCallback<NonNullable<ButtonProps["onClick"]>>(() => {
    router.push(`/articles/${articleId}`);
  }, [articleId, router]);
  const handleEdit = useCallback<NonNullable<ButtonProps["onClick"]>>(() => {
    router.push(`/${userId}/articles/${articleId}/edit`);
  }, [articleId, router, userId]);

  return (
    <div className={styles.wrapper}>
      <Article
        heading={
          <div className={styles.heading2Wrapper}>
            <Heading2>{title}</Heading2>
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
          <div className={styles.buttonsWrapper}>
            <Button onClick={handleConfirm}>記事を確認する</Button>
            <Button onClick={handleEdit}>記事を修正する</Button>
            <Button onClick={onDelete}>記事を削除する</Button>
          </div>
        </div>
      </Article>
    </div>
  );
}

export default MyArticleDetail;
