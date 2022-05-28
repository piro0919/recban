import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import ProfileNew, { ProfileNewProps } from "components/templates/ProfileNew";
import Seo from "components/templates/Seo";
import UserContext from "contexts/UserContext";
import { getAdditionalUserInfo } from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import useUser from "hooks/useUser";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { PostUsersUidBody, PostUsersUidData } from "pages/api/users/[uid]";
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

export type NewProps = {
  uid: string;
};

function New({ uid }: NewProps): JSX.Element {
  const router = useRouter();
  const handleSubmit = useCallback<ProfileNewProps["onSubmit"]>(
    async ({ email, enabledContactEmail, name, notification, twitterId }) => {
      const myPromise = axios.post<
        PostUsersUidData,
        AxiosResponse<PostUsersUidData>,
        PostUsersUidBody
      >(`/api/users/${uid}`, {
        email,
        enabledContactEmail,
        name,
        notification,
        twitterId,
      });

      await toast.promise(myPromise, {
        error: "アカウントの作成に失敗しました…",
        loading: "アカウントを作成中です…",
        success: "アカウントを作成しました！",
      });

      router.push("/");
    },
    [router, uid]
  );
  const [defaultValues, setDefaultValues] =
    useState<ProfileNewProps["defaultValues"]>();
  const { userCredential } = useContext(UserContext);
  const { displayName, email, loading } = useUser();

  useEffect(() => {
    if (loading) {
      return;
    }

    let twitterId = "";

    if (userCredential) {
      const additionalUserInfo = getAdditionalUserInfo(userCredential);

      twitterId = additionalUserInfo?.username || "";
    }

    setDefaultValues({
      twitterId,
      email: email || "",
      enabledContactEmail: false,
      name: displayName || "",
      notification: false,
    });
  }, [displayName, email, loading, userCredential]);

  return (
    <>
      <Seo noindex={true} title="アカウントの作成" />
      {defaultValues ? (
        <ProfileNew defaultValues={defaultValues} onSubmit={handleSubmit} />
      ) : null}
    </>
  );
}

New.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  NewProps,
  ParsedUrlQuery
> = async ({ params }) => {
  if (!params) {
    return signout;
  }

  const { uid } = params;
  const db = getFirestore();
  const collectionRef = collection(db, "users");
  const docRef = doc(collectionRef, uid);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return {
      redirect: {
        destination: `/${uid}/edit`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      uid,
    },
  };
};

export default New;
