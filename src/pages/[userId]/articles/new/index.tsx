import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useCallback } from "react";
import { useSnackbar } from "react-simple-snackbar";
import Layout from "components/templates/Layout";
import MyArticleNew, {
  MyArticleNewProps,
} from "components/templates/MyArticleNew";
import Seo from "components/templates/Seo";
import axiosInstance from "libs/axiosInstance";
import base from "middlewares/base";
import { PostArticlesData, PostArticlesBody } from "pages/api/articles";

export type NewProps = {
  userId: string;
};

function New({ userId }: NewProps): JSX.Element {
  const router = useRouter();
  const [openSnackbar] = useSnackbar();
  const handleSubmit = useCallback<MyArticleNewProps["onSubmit"]>(
    async ({
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
    }) => {
      const {
        data: {
          sys: { id },
        },
      } = await axiosInstance.post<
        PostArticlesData,
        AxiosResponse<PostArticlesData>,
        PostArticlesBody
      >("/api/articles", {
        ambition,
        content,
        frequency,
        genres,
        parts,
        places,
        sex,
        title,
        userId,
        maxAge: parseInt(maxAge, 10),
        minAge: parseInt(minAge, 10),
      });

      openSnackbar("メンバーの募集を開始しました！");

      await router.push(`/${userId}/articles/${id}`);
    },
    [openSnackbar, router, userId]
  );

  return (
    <>
      <Seo noindex={true} title="メンバーの募集" />
      <MyArticleNew onSubmit={handleSubmit} />
    </>
  );
}

New.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  NewProps,
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

  return {
    props: { userId },
  };
};

export default New;
