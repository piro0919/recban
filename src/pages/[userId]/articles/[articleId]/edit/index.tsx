import { AxiosResponse } from "axios";
import { createClient } from "contentful";
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
import {
  PutArticlesArticleIdData,
  PutArticlesArticleIdBody,
} from "pages/api/articles/[articleId]";

export type EditProps = Pick<
  MyArticleNewProps,
  "articleId" | "defaultValues"
> & {
  articleId: string;
  userId: string;
};

function Edit({ articleId, defaultValues, userId }: EditProps): JSX.Element {
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
      } = await axiosInstance.put<
        PutArticlesArticleIdData,
        AxiosResponse<PutArticlesArticleIdData>,
        PutArticlesArticleIdBody
      >(`/api/articles/${articleId}`, {
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

      openSnackbar("記事を修正しました！");

      await router.push(`/${userId}/articles/${id}`);
    },
    [articleId, openSnackbar, router, userId]
  );

  return (
    <>
      <Seo noindex={true} title="記事の修正" />
      <MyArticleNew
        articleId={articleId}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />
    </>
  );
}

Edit.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  articleId: string;
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  EditProps,
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

  const client = createClient({
    accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN || "",
    space: process.env.CONTENTFUL_SPACE_ID || "",
  });
  const defaultValues = await client
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
      }) => ({
        ambition,
        content,
        frequency,
        genres,
        parts,
        places,
        sex,
        title,
        maxAge: maxAge.toString(),
        minAge: minAge.toString(),
      })
    );

  return {
    props: {
      articleId,
      defaultValues,
      userId,
    },
  };
};

export default Edit;
