import { createClient } from "contentful";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useCallback } from "react";
import { useSnackbar } from "react-simple-snackbar";
import Layout from "components/templates/Layout";
import MyArticleDetail, {
  MyArticleDetailProps,
} from "components/templates/MyArticleDetail";
import Seo from "components/templates/Seo";
import axiosInstance from "libs/axiosInstance";
import base from "middlewares/base";

export type ArticleIdProps = Pick<
  MyArticleDetailProps,
  | "age"
  | "ambition"
  | "articleId"
  | "content"
  | "frequency"
  | "fromDate"
  | "genre"
  | "part"
  | "place"
  | "sex"
  | "title"
  | "untilDate"
  | "userId"
> & {
  articleId: string;
  content: string;
  title: string;
};

function ArticleId({
  age,
  ambition,
  articleId,
  content,
  frequency,
  fromDate,
  genre,
  part,
  place,
  sex,
  title,
  untilDate,
  userId,
}: ArticleIdProps): JSX.Element {
  const [openSnackbar] = useSnackbar();
  const router = useRouter();
  const handleDelete = useCallback(async () => {
    await axiosInstance.delete(`/api/articles/${articleId}`);

    openSnackbar("記事を削除しました");

    await router.push(`/${userId}/articles`);
  }, [articleId, openSnackbar, router, userId]);

  return (
    <>
      <Seo description={content} noindex={true} title={title} />
      <MyArticleDetail
        age={age}
        ambition={ambition}
        articleId={articleId}
        content={content}
        frequency={frequency}
        fromDate={fromDate}
        genre={genre}
        onDelete={handleDelete}
        part={part}
        place={place}
        sex={sex}
        title={title}
        untilDate={untilDate}
        userId={userId}
      />
    </>
  );
}

ArticleId.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  articleId: string;
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  ArticleIdProps,
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

  const { articleId, userId } = params;

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

  if (
    !process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN ||
    !process.env.CONTENTFUL_ENVIRONMENT ||
    !process.env.CONTENTFUL_SPACE_ID
  ) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const client = createClient({
    accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    space: process.env.CONTENTFUL_SPACE_ID,
  });
  const {
    age,
    ambition,
    content,
    frequency,
    fromDate,
    genre,
    part,
    place,
    sex,
    title,
    untilDate,
  } = await client
    .getEntry<Contentful.IArticlesFields>(articleId)
    .then(
      ({
        fields: {
          ambition,
          content,
          frequency,
          genres,
          maxAge,
          minAge,
          parts,
          places,
          sex,
          title,
        },
        sys: { createdAt },
      }) => ({
        ambition,
        content,
        frequency,
        sex,
        title,
        age: `${minAge}歳 〜 ${maxAge}歳`,
        fromDate: dayjs(createdAt).format("YYYY.MM.DD"),
        genre: genres.join(", "),
        part: parts.join(", "),
        place: places.join(", "),
        untilDate: dayjs(createdAt).add(3, "months").format("YYYY.MM.DD"),
      })
    );

  return {
    props: {
      age,
      ambition,
      articleId,
      content,
      frequency,
      fromDate,
      genre,
      part,
      place,
      sex,
      title,
      untilDate,
      userId,
    },
  };
};

export default ArticleId;
