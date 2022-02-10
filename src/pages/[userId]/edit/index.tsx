import "libs/app";
import { AxiosResponse } from "axios";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useCallback } from "react";
import Layout from "components/templates/Layout";
import ProfileEdit, {
  ProfileEditProps,
} from "components/templates/ProfileEdit";
import Seo from "components/templates/Seo";
import axiosInstance from "libs/axiosInstance";
import base from "middlewares/base";
import {
  PutUsersUserIdData,
  PutUsersUserIdBody,
} from "pages/api/users/[userId]";

export type EditProps = Pick<ProfileEditProps, "defaultValues"> & {
  userId: string;
};

function Edit({ defaultValues, userId }: EditProps): JSX.Element {
  const router = useRouter();
  const handleSubmit = useCallback<ProfileEditProps["onSubmit"]>(
    async ({ email, enabledContactEmail, name, notification, twitterId }) => {
      await axiosInstance.put<
        PutUsersUserIdData,
        AxiosResponse<PutUsersUserIdData>,
        PutUsersUserIdBody
      >(`/api/users/${userId}`, {
        email,
        enabledContactEmail,
        name,
        notification,
        twitterId,
      });

      router.push(`/${userId}`);
    },
    [router, userId]
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
  userId: string;
};

export const getServerSideProps: GetServerSideProps<
  EditProps,
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
      userId,
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
