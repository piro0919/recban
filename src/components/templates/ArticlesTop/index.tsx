import styles from "./style.module.scss";
import ArticleList, {
  ArticleListProps,
} from "components/organisms/ArticleList";
import SearchForm, { SearchFormProps } from "components/organisms/SearchForm";

export type ArticlesTopProps = Pick<ArticleListProps, "articles"> &
  Pick<SearchFormProps, "defaultValues" | "onSubmit"> & {
    total: string;
  };

function ArticlesTop({
  articles,
  defaultValues,
  onSubmit,
  total,
}: ArticlesTopProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div className={styles.detailWrapper}>
        <div className={styles.counteWrapper}>{`募集中の記事：${total}`}</div>
        <div className={styles.formWrapper}>
          <SearchForm defaultValues={defaultValues} onSubmit={onSubmit} />
        </div>
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}

export default ArticlesTop;
