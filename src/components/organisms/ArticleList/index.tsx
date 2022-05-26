import Heading2 from "components/atoms/Heading2";
import Article from "components/molecules/Article";
import DefinitionList from "components/molecules/DefinitionList";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import styles from "./style.module.scss";

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
  uid?: string;
};

function ArticleList({ articles, uid }: ArticleListProps): JSX.Element {
  const items = useMemo(
    () =>
      articles.map(
        (
          {
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
          },
          index
        ) => (
          <li className={styles.item} key={id}>
            <div className={styles.itemInner}>
              <Link href={uid ? `/${uid}/articles/${id}` : `/articles/${id}`}>
                <a className={styles.anchor}>
                  <div className={styles.imageWrapper}>
                    <Image
                      alt=""
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center right"
                      src={`/images/0${(index % 6) + 1}.png`}
                      unoptimized={true}
                    />
                  </div>
                  <Article heading={<Heading2 text={title} />}>
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
      ),
    [articles, uid]
  );

  return <ul className={styles.list}>{items}</ul>;
}

export default ArticleList;
