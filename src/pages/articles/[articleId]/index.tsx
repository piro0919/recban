import "libs/app";
import { AxiosResponse } from "axios";
import { createClient } from "contentful";
import dayjs from "dayjs";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import queryString from "query-string";
import { ReactElement, useCallback, useContext } from "react";
import ArticleDetail, {
  ArticleDetailProps,
} from "components/templates/ArticleDetail";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import UserContext from "contexts/UserContext";
import axiosInstance from "libs/axiosInstance";
import base from "middlewares/base";
import {
  GetMessagesData,
  PostMessagesBody,
  PostMessagesData,
} from "pages/api/messages";

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
  untilDate,
  ...props
}: ArticleIdProps): JSX.Element {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const handleSendMessage = useCallback(async () => {
    if (!user) {
      await router.push("/signout");

      return;
    }

    const { uid } = user;
    const {
      data: { hits },
    } = await axiosInstance.get<
      GetMessagesData,
      AxiosResponse<GetMessagesData>
    >(
      queryString.stringifyUrl({
        query: {
          filters: `articleId:${articleId} AND applicantUserId:${uid}`,
          query: "",
        },
        url: "/api/messages",
      })
    );

    if (hits.length) {
      const { objectID } = hits[0];

      router.push(`/${uid}/messages/${objectID}`);

      return;
    }

    const {
      data: { objectID },
    } = await axiosInstance.post<
      PostMessagesData,
      AxiosResponse<PostMessagesData>,
      PostMessagesBody
    >("/api/messages", { articleId, applicantUserId: uid });

    router.push(`/${uid}/messages/${objectID}`);
  }, [articleId, router, user]);
  const handleTransitionEmail = useCallback(async () => {
    if (!user) {
      await router.push("/signout");

      return;
    }

    const { uid } = user;

    await router.push(`/${uid}/articles/${articleId}/email/new`);
  }, [articleId, router, user]);

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
> = async (ctx) => {
  const { params, req, res } = ctx;

  if (!params) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const { articleId } = params;

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
    userId,
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
          userId,
        },
        sys: { createdAt },
      }) => ({
        ambition,
        content,
        frequency,
        sex,
        title,
        userId,
        age: `${minAge}歳 〜 ${maxAge}歳`,
        fromDate: dayjs(createdAt).format("YYYY.MM.DD"),
        genre: genres.join(", "),
        part: parts.join(", "),
        place: places.join(", "),
        untilDate: dayjs(createdAt).add(3, "months").format("YYYY.MM.DD"),
      })
    );

  try {
    await base().run(req, res);
  } catch (e) {
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
        isSignIn: false,
      },
    };
  }

  const db = getFirestore();
  const collectionRef = collection(db, "users");
  const docRef = doc(collectionRef, userId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const data = snapshot.data();
  const { email, enabledContactEmail, name, twitterId } =
    data as Firestore.User;

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
      untilDate,
      disabledEmail: !email || !enabledContactEmail,
      isSignIn: true,
    },
  };
};

export default ArticleId;
