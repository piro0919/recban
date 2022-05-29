import ArticleForm, {
  ArticleFormProps,
} from "components/organisms/ArticleForm";
import styles from "./style.module.scss";

export type MyArticleNewProps = Pick<
  ArticleFormProps,
  "articleId" | "defaultValues" | "onSubmit" | "previousFieldValues"
>;

function MyArticleNew({
  articleId,
  defaultValues,
  onSubmit,
  previousFieldValues,
}: MyArticleNewProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <ArticleForm
        articleId={articleId}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        previousFieldValues={previousFieldValues}
      />
    </div>
  );
}

export default MyArticleNew;
