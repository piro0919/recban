import "libs/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Layout from "components/templates/Layout";
import ProfileTop, { ProfileTopProps } from "components/templates/ProfileTop";
import Seo from "components/templates/Seo";
import base from "middlewares/base";

export type UserIdProps = Pick<
  ProfileTopProps,
  | "email"
  | "enabledContactEmail"
  | "name"
  | "notification"
  | "twitterId"
  | "userId"
>;

function UserId({
  email,
  enabledContactEmail,
  name,
  notification,
  twitterId,
  userId,
}: UserIdProps): JSX.Element {
  return (
    <>
      <Seo noindex={true} title={`${name}のアカウント情報`} />
      <ProfileTop
        email={email}
        enabledContactEmail={enabledContactEmail}
        name={name}
        notification={notification}
        twitterId={twitterId}
        userId={userId}
      />
    </>
  );
}

UserId.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  UserIdProps,
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

  const db = getFirestore();
  const collectionRef = collection(db, "users");
  const docRef = doc(collectionRef, userId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return {
      redirect: {
        destination: `/${userId}/new`,
        permanent: false,
      },
    };
  }

  const data = snapshot.data();
  const { email, enabledContactEmail, name, notification, twitterId } =
    data as Firestore.User;

  return {
    props: {
      email: email || "未設定",
      enabledContactEmail: enabledContactEmail ? "オン" : "オフ",
      name: name || "未設定",
      notification: notification ? "オン" : "オフ",
      twitterId: twitterId || "未設定",
      userId: userId || "未設定",
    },
  };
};

export default UserId;
