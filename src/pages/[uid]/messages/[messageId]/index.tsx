import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import MessageDetail, {
  MessageDetailProps,
} from "components/templates/MessageDetail";
import Seo from "components/templates/Seo";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import dayjs from "libs/dayjs";
import fetcher from "libs/fetcher";
import getClient from "libs/getClient";
import getEnvironment from "libs/getEnvironment";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { PostEmailData, PostEmailBody } from "pages/api/email";
import {
  PutMessagesMessageIdData,
  PutMessagesMessageIdBody,
  GetMessagesMessageIdData,
} from "pages/api/messages/[messageId]";
import { ReactElement, useCallback, useMemo } from "react";
import useSWR from "swr";

export type MessageIdProps = Pick<
  MessageDetailProps,
  "articleId" | "collocutorName" | "isApplicant"
> & {
  applicantUid: string;
  articleId: string;
  collocutorName: string;
  collocutorNotification: boolean;
  collocutorUid: string;
  isApplicant: boolean;
  messageId: string;
  name: string;
  prefetchedData: GetMessagesMessageIdData;
  uid: string;
};

function MessageId({
  applicantUid,
  articleId,
  collocutorName,
  collocutorNotification,
  collocutorUid,
  isApplicant,
  messageId,
  name,
  prefetchedData,
  uid,
}: MessageIdProps): JSX.Element {
  const { data, mutate } = useSWR<GetMessagesMessageIdData>(
    `/api/messages/${messageId}`,
    fetcher,
    {
      fallbackData: prefetchedData,
    }
  );
  const handleSubmit = useCallback<MessageDetailProps["onSubmit"]>(
    async ({ content }) => {
      const message = `${dayjs().format()},${
        isApplicant ? "applicant" : "recruiter"
      },${content}`;
      // 最新のメッセージを取得する
      const data = await mutate();
      const messages =
        data && data.fields.messages
          ? [...data.fields.messages, message]
          : [message];

      await axios.put<
        PutMessagesMessageIdData,
        AxiosResponse<PutMessagesMessageIdData>,
        PutMessagesMessageIdBody
      >(`/api/messages/${messageId}`, {
        applicantUid,
        articleId,
        messages,
        unreadUser: isApplicant ? "recruiter" : "applicant",
      });

      // バウンドミューテートにすると取得しきれないケースがある
      await mutate();

      if (!collocutorNotification) {
        return;
      }

      await axios.post<
        PostEmailData,
        AxiosResponse<PostEmailData>,
        PostEmailBody
      >("/api/email", {
        collocutorUid,
        uid,
        subject: `${name} さんからメッセージが届きました`,
        text: `${content}\n\n${window.location.origin}/${collocutorUid}/messages/${messageId}`,
      });
    },
    [
      applicantUid,
      articleId,
      collocutorNotification,
      collocutorUid,
      isApplicant,
      messageId,
      mutate,
      name,
      uid,
    ]
  );
  const messages = useMemo<MessageDetailProps["messages"]>(() => {
    if (!data || !data.fields.messages) {
      return [];
    }

    const {
      fields: { messages },
    } = data;

    return messages.map((message) => {
      const [date, user, ...contents] = message.split(",");

      return {
        date,
        user,
        content: contents.join(","),
      };
    });
  }, [data]);

  return (
    <>
      <Seo noindex={true} title={`${collocutorName} さんとのメッセージ`} />
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
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  MessageIdProps,
  ParsedUrlQuery
> = async ({ params }) => {
  const client = getClient();

  if (!client || !params) {
    return signout;
  }

  const { messageId, uid } = params;
  const entry = await client.getEntry<Contentful.IMessagesFields>(messageId);
  const {
    fields: { applicantUid, articleId, messages, unreadUser },
  } = entry;
  const {
    fields: { uid: recruiterUid },
  } = await client.getEntry<Contentful.IArticlesFields>(articleId);
  // 自身が応募者であるか否か
  const isApplicant = applicantUid === uid;

  if (
    (isApplicant && unreadUser === "applicant") ||
    (!isApplicant && unreadUser === "recruiter")
  ) {
    const environment = await getEnvironment();

    if (!environment) {
      return signout;
    }

    const entry = await environment.getEntry(messageId, {
      content_type: "messages" as Contentful.CONTENT_TYPE,
    });

    entry.fields = {
      applicantUid: {
        ja: applicantUid,
      },
      articleId: {
        ja: articleId,
      },
      messages: {
        ja: messages,
      },
      unreadUser: {
        // 既読に変更
        ja: undefined,
      },
    };

    // TODO: patch で更新したかったが 415 が返却されるためしぶしぶ
    const updatedEntry = await entry.update();

    await updatedEntry.publish();
  }

  const db = getFirestore();
  const collectionRef = collection(db, "users");
  const applicantDocRef = doc(collectionRef, applicantUid);
  const recruiterDocRef = doc(collectionRef, recruiterUid);
  const [applicantSnapshot, recruiterSnapshot] = await Promise.all([
    getDoc(applicantDocRef),
    getDoc(recruiterDocRef),
  ]);

  if (!applicantSnapshot.exists() || !recruiterSnapshot.exists()) {
    return signout;
  }

  let collocutorName = "";
  let collocutorNotification = false;
  let name = "";

  const { name: applicantName, notification: applicantNotification } =
    applicantSnapshot.data() as Firestore.User;
  const { name: recruiterName, notification: recruiterNotification } =
    recruiterSnapshot.data() as Firestore.User;

  if (isApplicant) {
    collocutorName = recruiterName;
    collocutorNotification = recruiterNotification;
    name = applicantName;
  } else {
    collocutorName = applicantName;
    collocutorNotification = applicantNotification;
    name = recruiterName;
  }

  return {
    props: {
      applicantUid,
      articleId,
      collocutorName,
      collocutorNotification,
      isApplicant,
      messageId,
      name,
      uid,
      collocutorUid: isApplicant ? recruiterUid : applicantUid,
      prefetchedData: entry,
    },
  };
};

export default MessageId;
