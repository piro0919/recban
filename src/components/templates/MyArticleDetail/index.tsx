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
                <Heading3>??????</Heading3>
              </div>
            }
          >
            <div className={styles.inner2}>
              <DefinitionList
                definitions={[
                  {
                    description: part,
                    term: "???????????????",
                  },
                  {
                    description: genre,
                    term: "????????????",
                  },
                  {
                    description: sex,
                    term: "??????",
                  },
                  {
                    description: age,
                    term: "??????",
                  },
                  {
                    description: place,
                    term: "????????????",
                  },
                  {
                    description: frequency,
                    term: "????????????",
                  },
                  {
                    description: ambition,
                    term: "?????????",
                  },
                  {
                    description: fromDate,
                    term: "???????????????",
                  },
                  {
                    description: untilDate,
                    term: "???????????????",
                  },
                ]}
              />
            </div>
          </Article>
          <HorizontalRule />
          <div className={styles.inner2}>
            <div className={styles.buttonsWrapper}>
              <Button onClick={handleConfirm}>?????????????????????</Button>
              <Button onClick={handleEdit}>?????????????????????</Button>
              <Button onClick={onDelete}>?????????????????????</Button>
              {origin ? (
                <TwitterShareButton
                  className={styles.twitterShareButton}
                  hashtags={["???????????????"]}
                  title={title}
                  url={`${origin}/articles/${articleId}`}
                  via={twitterId}
                >
                  Twitter??????????????????
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
