import ArticleList, {
  ArticleListProps,
} from "components/organisms/ArticleList";
import styles from "./style.module.scss";

export type MyArticlesTopProps = Pick<ArticleListProps, "articles" | "uid"> & {
  total: number;
};

function MyArticlesTop({
  articles,
  total,
  uid,
}: MyArticlesTopProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.counterWrapper}
      >{`募集中の記事：${total} 件 / 最大 3 件`}</div>
      <ArticleList articles={articles} uid={uid} />
    </div>
  );
}

export default MyArticlesTop;
