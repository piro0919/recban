import Link from "next/link";
import styles from "./style.module.scss";
import Heading2 from "components/atoms/Heading2";
import Article from "components/molecules/Article";
import DefinitionList from "components/molecules/DefinitionList";

type Article = {
  age: string;
  ambition: string;
  frequency: string;
  fromDate: string;
  genre: string;
  id: string;
  part: string;
  place: string;
  sex: string;
  title: string;
};

export type ArticleListProps = {
  articles: Article[];
  userId?: string;
};

function ArticleList({ articles, userId }: ArticleListProps): JSX.Element {
  return (
    <ul className={styles.list}>
      {articles.map(
        ({
          age,
          ambition,
          frequency,
          fromDate,
          genre,
          id,
          part,
          place,
          sex,
          title,
        }) => (
          <li className={styles.item} key={id}>
            <div className={styles.itemInner}>
              <Link
                href={userId ? `/${userId}/articles/${id}` : `/articles/${id}`}
              >
                <a className={styles.anchor}>
                  <Article heading={<Heading2>{title}</Heading2>}>
                    <div>
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
                        ]}
                      />
                      <div className={styles.viewDetailWrapper}>
                        <p className={styles.viewDetail}>詳細を見る</p>
                      </div>
                    </div>
                  </Article>
                </a>
              </Link>
            </div>
          </li>
        )
      )}
    </ul>
  );
}

export default ArticleList;
