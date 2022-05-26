import Heading2 from "components/atoms/Heading2";
import HorizontalRule from "components/atoms/HorizontalRule";
import Article from "components/molecules/Article";
import EmailForm, { EmailFormProps } from "components/organisms/EmailForm";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import styles from "./style.module.scss";

export type MyEmailNewProps = Pick<EmailFormProps, "disabled" | "onSubmit"> & {
  articleId?: string;
  collocutorName: string;
};

function MyEmailNew({
  articleId,
  collocutorName,
  disabled,
  onSubmit,
}: MyEmailNewProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <Article
        heading={
          <div className={styles.heading2Wrapper}>
            <Heading2 text={collocutorName} />
            {articleId ? (
              <Link href={`/articles/${articleId}`}>
                <a className={styles.anchor} target="_blank">
                  記事を確認する
                  <BiLinkExternal />
                </a>
              </Link>
            ) : null}
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
            <EmailForm disabled={disabled} onSubmit={onSubmit} />
          </div>
        </div>
      </Article>
    </div>
  );
}

export default MyEmailNew;
