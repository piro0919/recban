import { createClient } from "contentful";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import queryString from "query-string";
import { ReactElement, useCallback } from "react";
import ArticlesTop, {
  ArticlesTopProps,
} from "components/templates/ArticlesTop";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";

export type PagesProps = Pick<
  ArticlesTopProps,
  "articles" | "defaultValues" | "total"
>;

function Pages({ articles, defaultValues, total }: PagesProps): JSX.Element {
  const router = useRouter();
  const handleSubmit = useCallback<ArticlesTopProps["onSubmit"]>(
    (data) => {
      router.push({
        pathname: "/",
        query: queryString.stringify(data, { skipEmptyString: true }),
      });
    },
    [router]
  );

  return (
    <>
      <Seo noindex={false} title="バンドメンバーを見つける" />
      <ArticlesTop
        articles={articles}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        total={total}
      />
    </>
  );
}

Pages.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps<PagesProps> = async ({
  query: { age, ambition, genre, part, place, query, sex },
}) => {
  if (
    Array.isArray(age) ||
    Array.isArray(ambition) ||
    Array.isArray(genre) ||
    Array.isArray(part) ||
    Array.isArray(place) ||
    Array.isArray(query) ||
    Array.isArray(sex)
  ) {
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
      query,
      content_type: "articles" as Contentful.CONTENT_TYPE,
      "fields.ambition": ambition,
      "fields.genres": genre,
      "fields.maxAge[gte]": age,
      "fields.minAge[lte]": age,
      "fields.parts": part,
      "fields.places": place,
      "fields.sex": sex,
      limit: 24,
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
      defaultValues: {
        age: age || "",
        ambition: ambition || "",
        genre: genre || "",
        part: part || "",
        place: place || "",
        query: query || "",
        sex: sex || "",
      },
    },
  };
};

export default Pages;
