import styles from "./style.module.scss";
import ArticleList, {
  ArticleListProps,
} from "components/organisms/ArticleList";

export type MyArticlesTopProps = Pick<
  ArticleListProps,
  "articles" | "userId"
> & {
  total: string;
};

function MyArticlesTop({
  articles,
  total,
  userId,
}: MyArticlesTopProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div className={styles.counteWrapper}>{`募集中の記事：${total}`}</div>
      <ArticleList articles={articles} userId={userId} />
    </div>
  );
}

export default MyArticlesTop;
