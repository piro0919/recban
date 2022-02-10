import styles from "./style.module.scss";
import ArticleForm, {
  ArticleFormProps,
} from "components/organisms/ArticleForm";

export type MyArticleNewProps = Pick<
  ArticleFormProps,
  "articleId" | "defaultValues" | "onSubmit"
>;

function MyArticleNew({
  articleId,
  defaultValues,
  onSubmit,
}: MyArticleNewProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <ArticleForm
        articleId={articleId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default MyArticleNew;
