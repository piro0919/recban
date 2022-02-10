import "libs/app";
import algoliasearch from "algoliasearch";
import { createClient } from "contentful";
import dayjs from "dayjs";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Layout from "components/templates/Layout";
import MessagesTop, {
  MessagesTopProps,
} from "components/templates/MessagesTop";
import Seo from "components/templates/Seo";
import base from "middlewares/base";

export type MessagesProps = Pick<MessagesTopProps, "messages" | "userId">;

function Messages({ messages, userId }: MessagesProps): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="メッセージ一覧" />
      <MessagesTop messages={messages} userId={userId} />
    </>
  );
}

Messages.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  MessagesProps,
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

  if (
    !process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN ||
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
    space: process.env.CONTENTFUL_SPACE_ID,
  });
  const { articles } = await client
    .getEntries<Contentful.IArticlesFields>({
      content_type: "articles" as Contentful.CONTENT_TYPE,
      "fields.userId": userId,
      limit: 3,
    })
    .then(({ items }) => ({
      articles: items.map(({ sys: { id } }) => ({ id })),
    }));

  if (
    !process.env.ALGOLIA_APPLICATION_ID ||
    !process.env.ALGOLIA_ADMIN_API_KEY ||
    !process.env.ALGOLIA_MESSAGES_INDEX_NAME
  ) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const client2 = algoliasearch(
    process.env.ALGOLIA_APPLICATION_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );
  const index = client2.initIndex(process.env.ALGOLIA_MESSAGES_INDEX_NAME);
  const db = getFirestore();
  const collectionRef = collection(db, "users");
  const { messages } = await index
    .search<Algolia.Message>("", {
      filters: [
        articles.map(({ id }) => `articleId:${id}`).join(" OR "),
        `applicantUserId:${userId}`,
      ]
        .filter((v) => v)
        .join(" OR "),
    })
    .then(async ({ hits }) => ({
      messages: await Promise.all(
        hits.map(async ({ applicantUserId, messages, objectID }) => {
          const { content, date } = messages.length
            ? messages[0]
            : { content: "aaa", date: "bbb" };
          const docRef = doc(collectionRef, applicantUserId);
          const snapshot = await getDoc(docRef);
          const data = snapshot.exists() ? snapshot.data() : undefined;
          const { name } = (data || {}) as Partial<Firestore.User>;

          return {
            content,
            date: dayjs(date).format("YYYY.MM.DD HH:mm"),
            id: objectID,
            name: `${name || ""}さん`,
          };
        })
      ),
    }));

  return {
    props: {
      messages,
      userId,
    },
  };
};

export default Messages;
