import ArticleList, {
  ArticleListProps,
} from "components/organisms/ArticleList";
import SearchForm, { SearchFormProps } from "components/organisms/SearchForm";
import { FcEmptyFilter, FcFilledFilter } from "react-icons/fc";
import { useBoolean } from "usehooks-ts";
import styles from "./style.module.scss";

export type ArticlesTopProps = Pick<ArticleListProps, "articles"> &
  Pick<SearchFormProps, "defaultValues" | "onSubmit"> & {
    total: number;
  };

function ArticlesTop({
  articles,
  defaultValues,
  onSubmit,
  total,
}: ArticlesTopProps): JSX.Element {
  const {
    setFalse: offIsOpen,
    setTrue: onIsOpen,
    value: isOpen,
  } = useBoolean(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.detailWrapper}>
        <div className={isOpen ? styles.open : styles.close}>
          <SearchForm defaultValues={defaultValues} onSubmit={onSubmit} />
        </div>
        <div className={styles.detailWrapper2}>
          <div
            className={styles.counterWrapper}
          >{`募集中の記事：${total} 件`}</div>
          {isOpen ? (
            <button onClick={offIsOpen}>
              <FcFilledFilter size={24} />
            </button>
          ) : (
            <button onClick={onIsOpen}>
              <FcEmptyFilter size={24} />
            </button>
          )}
        </div>
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}

export default ArticlesTop;
