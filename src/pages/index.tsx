import ArticlesTop, {
  ArticlesTopProps,
} from "components/templates/ArticlesTop";
import LandingTop from "components/templates/LandingTop";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import dayjs from "libs/dayjs";
import getClient from "libs/getClient";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";
import queryString from "query-string";
import { useCallback } from "react";

export type PagesProps =
  | (Pick<ArticlesTopProps, "articles" | "defaultValues" | "total"> & {
      isFirstAccess: false;
    })
  | {
      isFirstAccess: true;
    };

function Pages(props: PagesProps): JSX.Element {
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
      <Seo noindex={false} title="バンドメンバーを見つけよう！" />
      {props.isFirstAccess ? (
        <LandingTop />
      ) : (
        <Layout>
          <ArticlesTop
            articles={props.articles}
            defaultValues={props.defaultValues}
            onSubmit={handleSubmit}
            total={props.total}
          />
        </Layout>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PagesProps> = async (
  ctx
) => {
  const { isFirstAccess } = nookies.get(ctx);

  if (isFirstAccess !== "false") {
    return {
      props: {
        isFirstAccess: true,
      },
    };
  }

  const {
    query: { age, ambition, genre, part, place, query, sex },
  } = ctx;
  const client = getClient();

  if (
    Array.isArray(age) ||
    Array.isArray(ambition) ||
    Array.isArray(genre) ||
    Array.isArray(part) ||
    Array.isArray(place) ||
    Array.isArray(query) ||
    Array.isArray(sex) ||
    !client
  ) {
    return signout;
  }

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
      defaultValues: {
        age: age || "",
        ambition: ambition || "",
        genre: genre || "",
        part: part || "",
        place: place || "",
        query: query || "",
        sex: sex || "",
      },
      isFirstAccess: false,
    },
  };
};

export default Pages;
