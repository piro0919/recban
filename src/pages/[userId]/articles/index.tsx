import { createClient } from "contentful";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Layout from "components/templates/Layout";
import MyArticlesTop, {
  MyArticlesTopProps,
} from "components/templates/MyArticlesTop";
import Seo from "components/templates/Seo";
import base from "middlewares/base";

export type ArticlesProps = Pick<
  MyArticlesTopProps,
  "articles" | "total" | "userId"
>;

function Articles({ articles, total, userId }: ArticlesProps): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="募集中の記事" />
      <MyArticlesTop articles={articles} total={total} userId={userId} />
    </>
  );
}

Articles.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  ArticlesProps,
  ParsedUrlQuery
> = async ({ params, req, res }) => {
  if (!params) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const { userId } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as Record<string, any>).userId = userId;

  try {
    await base().run(req, res);
  } catch (e) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const client = createClient({
    accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN || "",
    space: process.env.CONTENTFUL_SPACE_ID || "",
  });
  const { articles, total } = await client
    .getEntries<Contentful.IArticlesFields>({
      content_type: "articles" as Contentful.CONTENT_TYPE,
      "fields.userId": userId,
      limit: 3,
    })
    .then(({ items, total }) => ({
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
      total: `${total.toLocaleString()} 件`,
    }));

  return {
    props: {
      articles,
      total,
      userId,
    },
  };
};

export default Articles;
