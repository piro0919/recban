import ArticlesTop, {
  ArticlesTopProps,
} from "components/templates/ArticlesTop";
import LandingTop, { LandingTopProps } from "components/templates/LandingTop";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import dayjs from "libs/dayjs";
import getClient from "libs/getClient";
import infoToast from "libs/infoToast";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import nookies, { setCookie } from "nookies";
import queryString from "query-string";
import { useCallback } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";

export type PagesProps =
  | (Pick<ArticlesTopProps, "articles" | "defaultValues" | "total"> & {
      isFirstAccess: false;
    })
  | (Pick<LandingTopProps, "totalNumberOfArticles"> & {
      isFirstAccess: true;
    });

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
  const handleSaveSearchConditions = useCallback(async () => {
    if (props.isFirstAccess) {
      return;
    }

    const result = await swal({
      buttons: ["キャンセル", "OK"],
      icon: "info",
      text: "検索条件を保存すると、検索条件を設定していない検索時に保存された検索条件が自動的に反映されるようになります\n検索条件を保存しますか？",
      title: "検索条件の保存",
    });

    if (!result) {
      infoToast("検索条件の保存をキャンセルしました");

      return;
    }

    setCookie(null, "searchConditions", JSON.stringify(props.defaultValues), {
      maxAge: 60 * 60 * 24 * 30 * 12 * 10,
      path: "/",
      sameSite: "Lax",
    });

    toast.success("検索条件を保存しました");
  }, [props]);

  return (
    <>
      <Seo noindex={false} title="最高のバンドメンバーと出会おう！" />
      {props.isFirstAccess ? (
        <LandingTop totalNumberOfArticles={props.totalNumberOfArticles} />
      ) : (
        <Layout>
          <ArticlesTop
            articles={props.articles}
            defaultValues={props.defaultValues}
            onSaveSearchConditions={handleSaveSearchConditions}
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
  const { isFirstAccess, searchConditions } = nookies.get(ctx);
  const client = getClient();

  if (!client) {
    return signout;
  }

  if (isFirstAccess !== "false") {
    const { total } = await client.getEntries<Contentful.IArticlesFields>({
      content_type: "articles" as Contentful.CONTENT_TYPE,
    });

    return {
      props: {
        isFirstAccess: true,
        totalNumberOfArticles: total,
      },
    };
  }

  const {
    query: {
      age: queryAge,
      ambition: queryAmbition,
      genre: queryAgenre,
      part: queryPart,
      place: queryPlace,
      query: queryQuery,
      sex: querySex,
    },
  } = ctx;

  let age = queryAge;
  let ambition = queryAmbition;
  let genre = queryAgenre;
  let part = queryPart;
  let place = queryPlace;
  let query = queryQuery;
  let sex = querySex;

  if (
    Array.isArray(age) ||
    Array.isArray(ambition) ||
    Array.isArray(genre) ||
    Array.isArray(part) ||
    Array.isArray(place) ||
    Array.isArray(query) ||
    Array.isArray(sex)
  ) {
    return signout;
  }

  if (
    searchConditions &&
    !age &&
    !ambition &&
    !genre &&
    !part &&
    !place &&
    !query &&
    !sex
  ) {
    const {
      age: searchConditionAge,
      ambition: searchConditionAmbition,
      genre: searchConditionGenre,
      part: searchConditionPart,
      place: searchConditionPlace,
      query: searchConditionQuery,
      sex: searchConditionSex,
    } = JSON.parse(searchConditions);

    age = searchConditionAge || undefined;
    ambition = searchConditionAmbition || undefined;
    genre = searchConditionGenre || undefined;
    part = searchConditionPart || undefined;
    place = searchConditionPlace || undefined;
    query = searchConditionQuery || undefined;
    sex = searchConditionSex || undefined;
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
