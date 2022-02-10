import "libs/app";
import { AxiosResponse } from "axios";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useCallback } from "react";
import { useSnackbar } from "react-simple-snackbar";
import Layout from "components/templates/Layout";
import ProfileNew, { ProfileNewProps } from "components/templates/ProfileNew";
import Seo from "components/templates/Seo";
import axiosInstance from "libs/axiosInstance";
import base from "middlewares/base";
import {
  PostUsersUserIdBody,
  PostUsersUserIdData,
} from "pages/api/users/[userId]";

export type NewProps = {
  userId: string;
};

function New({ userId }: NewProps): JSX.Element {
  const router = useRouter();
  const [openSnackbar] = useSnackbar();
  const handleSubmit = useCallback<ProfileNewProps["onSubmit"]>(
    async ({ email, enabledContactEmail, name, notification, twitterId }) => {
      await axiosInstance.post<
        PostUsersUserIdData,
        AxiosResponse<PostUsersUserIdData>,
        PostUsersUserIdBody
      >(`/api/users/${userId}`, {
        email,
        enabledContactEmail,
        name,
        notification,
        twitterId,
      });

      openSnackbar("アカウントを作成しました！");

      router.push(`/${userId}`);
    },
    [openSnackbar, router, userId]
  );

  return (
    <>
      <Seo noindex={true} title="アカウントの作成" />
      <ProfileNew onSubmit={handleSubmit} />
    </>
  );
}

New.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  NewProps,
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

  if (snapshot.exists()) {
    return {
      redirect: {
        destination: `/${userId}/edit`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId,
    },
  };
};

export default New;
