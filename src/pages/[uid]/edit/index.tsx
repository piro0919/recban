import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import ProfileEdit, {
  ProfileEditProps,
} from "components/templates/ProfileEdit";
import Seo from "components/templates/Seo";
import getFirestore from "libs/getFirestore";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { PutUsersUidData, PutUsersUidBody } from "pages/api/users/[uid]";
import { ReactElement, useCallback } from "react";
import toast from "react-hot-toast";

export type EditProps = Pick<ProfileEditProps, "defaultValues"> & {
  uid: string;
};

function Edit({ defaultValues, uid }: EditProps): JSX.Element {
  const router = useRouter();
  const handleSubmit = useCallback<ProfileEditProps["onSubmit"]>(
    async ({ email, enabledContactEmail, name, notification, twitterId }) => {
      const myPromise = axios.put<
        PutUsersUidData,
        AxiosResponse<PutUsersUidData>,
        PutUsersUidBody
      >(`/api/users/${uid}`, {
        email,
        enabledContactEmail,
        name,
        notification,
        twitterId,
      });

      await toast.promise(myPromise, {
        error: "ユーザー情報の修正に失敗しました…",
        loading: "ユーザー情報を修正中です…",
        success: "ユーザー情報を修正しました！",
      });

      router.push(`/${uid}`);
    },
    [router, uid]
  );

  return (
    <>
      <Seo noindex={true} title="アカウント情報の編集" />
      <ProfileEdit defaultValues={defaultValues} onSubmit={handleSubmit} />
    </>
  );
}

Edit.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  EditProps,
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
      uid,
      defaultValues: {
        email,
        enabledContactEmail,
        name,
        notification,
        twitterId,
      },
    },
  };
};

export default Edit;
