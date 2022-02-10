import "libs/app";
import algoliasearch from "algoliasearch";
import { AxiosResponse } from "axios";
import { createClient } from "contentful";
import dayjs from "dayjs";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import queryString from "query-string";
import { ReactElement, useCallback, useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";
import Layout from "components/templates/Layout";
import MessageDetail, {
  MessageDetailProps,
} from "components/templates/MessageDetail";
import Seo from "components/templates/Seo";
import axiosInstance from "libs/axiosInstance";
import fetcher from "libs/fetcher";
import { PostEmailData, PostEmailBody } from "pages/api/email";
import {
  PatchMessagesMessageIdData,
  PatchMessagesMessageIdBody,
  GetMessagesMessageIdData,
} from "pages/api/messages/[messageId]";

type Message = {
  content: string;
  date: string;
  user: "applicant" | "recruiter";
};

export type MessageIdProps = Pick<
  MessageDetailProps,
  "articleId" | "collocutorName" | "isApplicant"
> & {
  collocutorNotification: boolean;
  collocutorUserId: string;
  fallbackData: {
    messages: Message[];
  };
  messageId: string;
  name: string;
  user: "applicant" | "recruiter";
  userId: string;
};

function MessageId({
  articleId,
  collocutorName,
  collocutorNotification,
  collocutorUserId,
  fallbackData,
  isApplicant,
  messageId,
  name,
  user,
  userId,
}: MessageIdProps): JSX.Element {
  const { mutate } = useSWRConfig();
  const key = useMemo(
    () =>
      queryString.stringifyUrl({
        query: {
          attributesToRetrieve: ["messages"],
        },
        url: `/api/messages/${messageId}`,
      }),
    [messageId]
  );
  const { data } = useSWR<Pick<GetMessagesMessageIdData, "messages">>(
    key,
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
    }
  );
  const messages = useMemo<MessageDetailProps["messages"]>(
    () => (data ? data.messages : []),
    [data]
  );
  const handleSubmit = useCallback<MessageDetailProps["onSubmit"]>(
    async ({ content }) => {
      const nextMessages = [
        ...messages,
        {
          content,
          user,
          date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        },
      ];

      await axiosInstance.patch<
        PatchMessagesMessageIdData,
        AxiosResponse<PatchMessagesMessageIdData>,
        PatchMessagesMessageIdBody
      >(`/api/messages/${messageId}`, {
        messages: nextMessages,
      });

      await mutate(key, { messages: nextMessages }, false);

      if (!collocutorNotification) {
        return;
      }

      await axiosInstance.post<
        PostEmailData,
        AxiosResponse<PostEmailData>,
        PostEmailBody
      >("/api/email", {
        collocutorUserId,
        userId,
        subject: `${name}からメッセージが届きました`,
        text: content,
      });
    },
    [
      collocutorNotification,
      collocutorUserId,
      key,
      messageId,
      messages,
      mutate,
      name,
      user,
      userId,
    ]
  );

  return (
    <>
      <Seo noindex={true} title={`${collocutorName}とのメッセージ`} />
      <MessageDetail
        articleId={articleId}
        collocutorName={collocutorName}
        isApplicant={isApplicant}
        messages={messages}
        onSubmit={handleSubmit}
      />
    </>
  );
}

MessageId.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  messageId: string;
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  MessageIdProps,
  ParsedUrlQuery
> = async (ctx) => {
  const { params } = ctx;

  if (
    !params ||
    typeof process.env.ALGOLIA_ADMIN_API_KEY !== "string" ||
    typeof process.env.ALGOLIA_APPLICATION_ID !== "string"
  ) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const { messageId, userId } = params;
  const client = algoliasearch(
    process.env.ALGOLIA_APPLICATION_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );
  const index = client.initIndex("dev_MESSAGES");
  const { applicantUserId, articleId, messages } = await index.getObject<
    Pick<Algolia.Message, "applicantUserId" | "articleId" | "messages">
  >(messageId, {
    attributesToRetrieve: ["applicantUserId", "articleId", "messages"],
  });
  const isApplicant = applicantUserId === userId;

  let collocutorUserId = "";

  if (isApplicant) {
    // 自分が応募者の場合
    const client = createClient({
      accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN || "",
      space: process.env.CONTENTFUL_SPACE_ID || "",
    });

    await client
      .getEntry<Contentful.IArticlesFields>(articleId)
      .then(({ fields: { userId } }) => {
        collocutorUserId = userId;
      });
  } else {
    // 自分が募集者の場合
    collocutorUserId = applicantUserId;
  }

  if (userId === collocutorUserId) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
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

  if (!data) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const { name } = data as Firestore.User;
  const collocutorDocRef = doc(collectionRef, collocutorUserId);
  const collocutorSnapshot = await getDoc(collocutorDocRef);

  if (!collocutorSnapshot.exists()) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const collocutorData = collocutorSnapshot.data();

  if (!collocutorData) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  const {
    email: collocutorEmail,
    name: collocutorName,
    notification: collocutorNotification,
  } = collocutorData as Firestore.User;

  return {
    props: {
      articleId,
      collocutorUserId,
      isApplicant,
      messageId,
      userId,
      // 相手の名前
      collocutorName: `${collocutorName}さん`,
      collocutorNotification: !!collocutorEmail && collocutorNotification,
      fallbackData: {
        messages,
      },
      // 自分の名前
      name: `${name}さん`,
      user: isApplicant ? "applicant" : "recruiter",
    },
  };
};

export default MessageId;
