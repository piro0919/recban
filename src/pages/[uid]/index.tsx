import Layout from "components/templates/Layout";
import ProfileTop, { ProfileTopProps } from "components/templates/ProfileTop";
import Seo from "components/templates/Seo";
import getFirestore from "libs/getFirestore";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";

export type UserIdProps = Pick<
  ProfileTopProps,
  | "email"
  | "enabledContactEmail"
  | "name"
  | "notification"
  | "twitterId"
  | "uid"
>;

function UserId({
  email,
  enabledContactEmail,
  name,
  notification,
  twitterId,
  uid,
}: UserIdProps): JSX.Element {
  return (
    <>
      <Seo noindex={true} title={`${name} さんのアカウント情報`} />
      <ProfileTop
        email={email}
        enabledContactEmail={enabledContactEmail}
        name={name}
        notification={notification}
        twitterId={twitterId}
        uid={uid}
      />
    </>
  );
}

UserId.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  UserIdProps,
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
    return {
      redirect: {
        destination: `/${uid}/new`,
        permanent: false,
      },
    };
  }

  const { email, enabledContactEmail, name, notification, twitterId } =
    snapshot.data() as Firestore.User;

  return {
    props: {
      email,
      enabledContactEmail,
      name,
      notification,
      twitterId,
      uid,
    },
  };
};

export default UserId;
