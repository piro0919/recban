import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import Loading from "components/templates/Loading";
import MyArticleDetail, {
  MyArticleDetailProps,
} from "components/templates/MyArticleDetail";
import Seo from "components/templates/Seo";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import dayjs from "libs/dayjs";
import getClient from "libs/getClient";
import infoToast from "libs/infoToast";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { DeleteArticlesArticleIdData } from "pages/api/articles/[articleId]";
import { GetMessagesData } from "pages/api/messages";
import { DeleteMessagesMessageIdData } from "pages/api/messages/[messageId]";
import queryString from "query-string";
import { ReactElement, useCallback } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { useBoolean } from "usehooks-ts";

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
  | "twitterId"
  | "untilDate"
  | "uid"
> & {
  articleId: string;
  content: string;
  title: string;
  uid: string;
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
  twitterId,
  uid,
  untilDate,
}: ArticleIdProps): JSX.Element {
  const router = useRouter();
  const { setTrue: onIsDeleting, value: isDeleting } = useBoolean(false);
  const handleDelete = useCallback(async () => {
    const result = await swal({
      buttons: ["キャンセル", "OK"],
      icon: "warning",
      text: "募集を終了すると、\n記事と記事に紐づくメッセージもすべて削除されます\n本当に募集を終了しますか？",
      title: "募集の終了",
    });

    if (!result) {
      infoToast("募集の終了をキャンセルしました");

      return;
    }

    onIsDeleting();

    await axios.delete<
      DeleteArticlesArticleIdData,
      AxiosResponse<DeleteArticlesArticleIdData>
    >(`/api/articles/${articleId}`);

    const {
      data: { items },
    } = await axios.get<GetMessagesData, AxiosResponse<GetMessagesData>>(
      queryString.stringifyUrl({
        query: {
          articleId,
        },
        url: "/api/messages",
      })
    );

    items.forEach(async ({ sys: { id } }, index) => {
      await new Promise((resolve) => setTimeout(resolve, index * 500));

      await axios.delete<
        DeleteMessagesMessageIdData,
        AxiosResponse<DeleteMessagesMessageIdData>
      >(`/api/messages/${id}`);
    });

    toast.success("募集を終了しました！");

    router.push(`/${uid}/articles`);
  }, [articleId, onIsDeleting, router, uid]);

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
        twitterId={twitterId}
        uid={uid}
        untilDate={untilDate}
      />
      {isDeleting ? <Loading /> : null}
    </>
  );
}

ArticleId.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  articleId: string;
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  ArticleIdProps,
  ParsedUrlQuery
> = async ({ params }) => {
  if (!params) {
    return signout;
  }

  const { articleId, uid } = params;
  const client = getClient();

  if (!client) {
    return signout;
  }

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
  const db = getFirestore();
  const collectionRef = collection(db, "users");
  const docRef = doc(collectionRef, uid);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return signout;
  }

  const { twitterId } = snapshot.data() as Firestore.User;

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
      twitterId,
      uid,
      untilDate,
    },
  };
};

export default ArticleId;
