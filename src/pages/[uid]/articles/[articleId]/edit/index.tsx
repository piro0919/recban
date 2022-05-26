import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import MyArticleNew, {
  MyArticleNewProps,
} from "components/templates/MyArticleNew";
import Seo from "components/templates/Seo";
import getClient from "libs/getClient";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  PutArticlesArticleIdData,
  PutArticlesArticleIdBody,
} from "pages/api/articles/[articleId]";
import { ReactElement, useCallback } from "react";
import toast from "react-hot-toast";

export type EditProps = Pick<
  MyArticleNewProps,
  "articleId" | "defaultValues"
> & {
  articleId: string;
  uid: string;
};

function Edit({ articleId, defaultValues, uid }: EditProps): JSX.Element {
  const router = useRouter();
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
      } = await axios.put<
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
        uid,
        maxAge: parseInt(maxAge, 10),
        minAge: parseInt(minAge, 10),
      });

      toast.success("記事を修正しました！");

      router.push(`/${uid}/articles/${id}`);
    },
    [articleId, router, uid]
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
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  EditProps,
  ParsedUrlQuery
> = async ({ params }) => {
  const client = getClient();

  if (!params || !client) {
    return signout;
  }

  const { articleId, uid } = params;
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
      uid,
    },
  };
};

export default Edit;
