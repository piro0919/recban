import Layout from "components/templates/Layout";
import MyArticlesTop, {
  MyArticlesTopProps,
} from "components/templates/MyArticlesTop";
import Seo from "components/templates/Seo";
import dayjs from "libs/dayjs";
import getClient from "libs/getClient";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";

export type ArticlesProps = Pick<
  MyArticlesTopProps,
  "articles" | "total" | "uid"
>;

function Articles({ articles, total, uid }: ArticlesProps): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="募集中の記事" />
      <MyArticlesTop articles={articles} total={total} uid={uid} />
    </>
  );
}

Articles.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  ArticlesProps,
  ParsedUrlQuery
> = async ({ params }) => {
  const client = getClient();

  if (!params || !client) {
    return signout;
  }

  const { uid } = params;
  const { articles, total } = await client
    .getEntries<Contentful.IArticlesFields>({
      content_type: "articles" as Contentful.CONTENT_TYPE,
      "fields.uid": uid,
      limit: 3,
      order: "-sys.createdAt",
    })
    .then(({ items, total }) => ({
      total,
      articles: items.map(
        ({
          fields: {
            ambition,
            frequency,
            genres,
            maxAge,
            minAge,
            parts,
            places,
            sex,
            title,
          },
          sys: { createdAt, id },
        }) => ({
          ambition,
          frequency,
          id,
          sex,
          title,
          age: `${minAge}歳 〜 ${maxAge}歳`,
          fromDate: dayjs(createdAt).format("YYYY.MM.DD"),
          genre: genres.join(", "),
          part: parts.join(", "),
          place: places.join(", "),
        })
      ),
    }));

  return {
    props: {
      articles,
      total,
      uid,
    },
  };
};

export default Articles;
