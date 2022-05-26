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
import { PostArticlesData, PostArticlesBody } from "pages/api/articles";
import { ReactElement, useCallback } from "react";
import toast from "react-hot-toast";
import { useEffectOnce } from "usehooks-ts";

export type NewProps = {
  total: number;
  uid: string;
};

function New({ total, uid }: NewProps): JSX.Element {
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
      if (total >= 3) {
        toast.error("同時に 3 件以上募集をかけることはできません");

        return;
      }

      const {
        data: {
          sys: { id },
        },
      } = await axios.post<
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
        maxAge: parseInt(maxAge, 10),
        minAge: parseInt(minAge, 10),
        uid: uid,
      });

      toast.success("メンバーの募集を開始しました！");

      router.push(`/${uid}/articles/${id}`);
    },
    [router, total, uid]
  );

  useEffectOnce(() => {
    if (total < 3) {
      return;
    }

    toast.error("同時に 3 件以上募集をかけることはできません");
  });

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
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  NewProps,
  ParsedUrlQuery
> = async ({ params }) => {
  const client = getClient();

  if (!params || !client) {
    return signout;
  }

  const { uid } = params;
  const { total } = await client.getEntries<Contentful.IArticlesFields>({
    content_type: "articles" as Contentful.CONTENT_TYPE,
  });

  return {
    props: { total, uid },
  };
};

export default New;
