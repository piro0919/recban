import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import MyEmailNew, { MyEmailNewProps } from "components/templates/MyEmailNew";
import Seo from "components/templates/Seo";
import getClient from "libs/getClient";
import getFirestore from "libs/getFirestore";
import infoToast from "libs/infoToast";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { PostEmailData, PostEmailBody } from "pages/api/email";
import { ReactElement, useCallback } from "react";
import toast from "react-hot-toast";
import { useEffectOnce } from "usehooks-ts";

export type NewProps = Pick<
  MyEmailNewProps,
  "articleId" | "collocutorName" | "disabled"
> & {
  articleId: string;
  collocutorUid: string;
  name: string;
  uid: string;
};

function New({
  articleId,
  collocutorName,
  collocutorUid,
  disabled,
  name,
  uid,
}: NewProps): JSX.Element {
  const router = useRouter();
  const handleSubmit = useCallback<MyEmailNewProps["onSubmit"]>(
    async ({ subject, text }) => {
      if (disabled) {
        return;
      }

      const myPromise = axios.post<
        PostEmailData,
        AxiosResponse<PostEmailData>,
        PostEmailBody
      >("/api/email", {
        collocutorUid,
        uid,
        subject: `（${name} さん）${subject}`,
        text: `${text}\n\n${window.location.origin}/${collocutorUid}/articles/${articleId}`,
      });

      await toast.promise(myPromise, {
        error: "メールの送信に失敗しました…",
        loading: "メールを送信中です…",
        success: "メールを送信しました！",
      });

      router.push(`/articles/${articleId}`);
    },
    [articleId, collocutorUid, disabled, name, router, uid]
  );

  useEffectOnce(() => {
    if (!disabled) {
      return;
    }

    infoToast(
      <p>
        <Link href={`/${uid}/new`}>
          <a
            style={{
              color: "#8ab4f8",
              margin: "0 4px",
              textDecoration: "underline",
            }}
          >
            メールで連絡可能
          </a>
        </Link>
        がオフになっているためメールを送信できません
      </p>
    );
  });

  return (
    <>
      <Seo noindex={true} title="メールフォーム" />
      <MyEmailNew
        articleId={articleId}
        collocutorName={`${collocutorName} さん`}
        disabled={disabled}
        onSubmit={handleSubmit}
      />
    </>
  );
}

New.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout hasMargin={false}>{page}</Layout>;
};

type ParsedUrlQuery = {
  articleId: string;
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

  const { articleId, uid } = params;
  const { uid: collocutorUid } = await client
    .getEntry<Contentful.IArticlesFields>(articleId)
    .then(({ fields: { uid } }) => ({
      uid,
    }));

  if (uid === collocutorUid) {
    return signout;
  }

  const db = getFirestore();
  const collectionRef = db.collection("users");
  const docRef = collectionRef.doc(uid);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return signout;
  }

  const { enabledContactEmail, name } = snapshot.data() as Firestore.User;
  const collocutorDocRef = collectionRef.doc(collocutorUid);
  const collocutorSnapshot = await collocutorDocRef.get();

  if (!collocutorSnapshot.exists) {
    return signout;
  }

  const {
    enabledContactEmail: collocutorEnabledContactEmail,
    name: collocutorName,
  } = collocutorSnapshot.data() as Firestore.User;

  if (!collocutorEnabledContactEmail) {
    return signout;
  }

  return {
    props: {
      articleId,
      collocutorName,
      collocutorUid,
      name,
      uid,
      disabled: !enabledContactEmail,
    },
  };
};

export default New;
