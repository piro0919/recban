import axios, { AxiosResponse } from "axios";
import ArticleDetail, {
  ArticleDetailProps,
} from "components/templates/ArticleDetail";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import useUser from "hooks/useUser";
import dayjs from "libs/dayjs";
import getClient from "libs/getClient";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  GetMessagesData,
  PostMessagesBody,
  PostMessagesData,
} from "pages/api/messages";
import queryString from "query-string";
import { ReactElement, useCallback } from "react";
import toast from "react-hot-toast";

export type ArticleIdProps = Pick<
  ArticleDetailProps,
  | "age"
  | "ambition"
  | "content"
  | "frequency"
  | "fromDate"
  | "genre"
  | "part"
  | "place"
  | "sex"
  | "title"
  | "untilDate"
  | "uid"
> & {
  articleId: string;
  content: string;
  title: string;
} & (
    | {
        disabledEmail: boolean;
        isSignIn: true;
        name: string;
        twitterId: string;
      }
    | {
        isSignIn: false;
      }
  );

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
  uid,
  untilDate,
  ...props
}: ArticleIdProps): JSX.Element {
  const { uid: userUid } = useUser();
  const router = useRouter();
  const handleSendMessage = useCallback(async () => {
    if (!userUid) {
      toast(
        <p>
          <Link href="/signin">
            <a
              style={{
                color: "#8ab4f8",
                margin: "0 4px",
                textDecoration: "underline",
              }}
            >
              サインイン
            </a>
          </Link>
          するとメッセージが送信可能になります
        </p>
      );

      return;
    }

    const {
      data: { items },
    } = await axios.get<GetMessagesData, AxiosResponse<GetMessagesData>>(
      queryString.stringifyUrl({
        query: {
          articleId,
          applicantUserId: userUid,
        },
        url: "/api/messages",
      })
    );

    if (items.length) {
      const {
        sys: { id },
      } = items[0];

      router.push(`/${userUid}/messages/${id}`);

      return;
    }

    const {
      data: {
        sys: { id },
      },
    } = await axios.post<
      PostMessagesData,
      AxiosResponse<PostMessagesData>,
      PostMessagesBody
    >("/api/messages", { articleId, applicantUid: userUid });

    router.push(`/${userUid}/messages/${id}`);
  }, [articleId, router, userUid]);
  const handleTransitionEmail = useCallback(() => {
    if (!userUid) {
      toast(
        <p>
          <Link href="/signin">
            <a
              style={{
                color: "#8ab4f8",
                margin: "0 4px",
                textDecoration: "underline",
              }}
            >
              サインイン
            </a>
          </Link>
          するとメールが送信可能になります
        </p>
      );

      return;
    }

    router.push(`/${userUid}/articles/${articleId}/email/new`);
  }, [articleId, router, userUid]);

  return (
    <>
      <Seo description={content} noindex={false} title={title} />
      {props.isSignIn ? (
        <ArticleDetail
          age={age}
          ambition={ambition}
          content={content}
          disabledEmail={props.disabledEmail}
          frequency={frequency}
          fromDate={fromDate}
          genre={genre}
          isSignIn={props.isSignIn}
          name={props.name}
          onSendMessage={handleSendMessage}
          onTransitionEmail={handleTransitionEmail}
          part={part}
          place={place}
          sex={sex}
          title={title}
          twitterId={props.twitterId}
          uid={uid}
          untilDate={untilDate}
        />
      ) : (
        <ArticleDetail
          age={age}
          ambition={ambition}
          content={content}
          frequency={frequency}
          fromDate={fromDate}
          genre={genre}
          isSignIn={props.isSignIn}
          part={part}
          place={place}
          sex={sex}
          title={title}
          uid={uid}
          untilDate={untilDate}
        />
      )}
    </>
  );
}

ArticleId.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  articleId: string;
};

export const getServerSideProps: GetServerSideProps<
  ArticleIdProps,
  ParsedUrlQuery
> = async ({ params }) => {
  const client = getClient();

  if (!params || !client) {
    return signout;
  }

  const { articleId } = params;
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
    uid,
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
          uid,
        },
        sys: { createdAt },
      }) => ({
        ambition,
        content,
        frequency,
        sex,
        title,
        uid,
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

  const { enabledContactEmail, name, twitterId } =
    snapshot.data() as Firestore.User;

  return {
    props: {
      age,
      ambition,
      articleId,
      content,
      frequency,
      fromDate,
      genre,
      name,
      part,
      place,
      sex,
      title,
      twitterId,
      uid,
      untilDate,
      disabledEmail: !enabledContactEmail,
      isSignIn: true,
    },
  };
};

export default ArticleId;
