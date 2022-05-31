import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import MyEmailNew, { MyEmailNewProps } from "components/templates/MyEmailNew";
import Seo from "components/templates/Seo";
import getFirestore from "libs/getFirestore";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { PostEmailData, PostEmailBody } from "pages/api/email";
import { ReactElement, useCallback } from "react";
import toast from "react-hot-toast";

export type ReportProps = {
  name: string;
  uid: string;
};

function Report({ name, uid }: ReportProps): JSX.Element {
  const handleSubmit = useCallback<MyEmailNewProps["onSubmit"]>(
    async ({ subject, text }) => {
      const myPromise = axios.post<
        PostEmailData,
        AxiosResponse<PostEmailData>,
        PostEmailBody
      >("/api/email", {
        text,
        uid,
        subject: `（${name} さん）${subject}`,
      });

      await toast.promise(myPromise, {
        error: "メールの送信に失敗しました…",
        loading: "メールを送信中です…",
        success: "メールを送信しました！",
      });
    },
    [name, uid]
  );

  return (
    <>
      <Seo noindex={true} title="フィードバックを送信" />
      <MyEmailNew collocutorName="フィードバック" onSubmit={handleSubmit} />
    </>
  );
}

Report.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout hasMargin={false}>{page}</Layout>;
};

type ParsedUrlQuery = {
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  ReportProps,
  ParsedUrlQuery
> = async ({ params }) => {
  if (!params) {
    return signout;
  }

  const { uid } = params;
  const db = getFirestore();
  const collectionRef = db.collection("users");
  const docRef = collectionRef.doc(uid);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return signout;
  }

  const { name } = snapshot.data() as Firestore.User;

  return {
    props: {
      name,
      uid,
    },
  };
};

export default Report;
