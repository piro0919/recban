import "libs/app";
import { AxiosResponse } from "axios";
import { createClient } from "contentful";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { ReactElement, useCallback, useEffect } from "react";
import { useSnackbar } from "react-simple-snackbar";
import Layout from "components/templates/Layout";
import MyEmailNew, { MyEmailNewProps } from "components/templates/MyEmailNew";
import Seo from "components/templates/Seo";
import axiosInstance from "libs/axiosInstance";
import base from "middlewares/base";
import { PostEmailData, PostEmailBody } from "pages/api/email";

export type NewProps = Pick<MyEmailNewProps, "articleId" | "collocutorName"> & {
  collocutorUserId: string;
  enabledEmail: boolean;
  name: string;
  userId: string;
};

function New({
  articleId,
  collocutorName,
  collocutorUserId,
  enabledEmail,
  name,
  userId,
}: NewProps): JSX.Element {
  const [openSnackbar] = useSnackbar();
  const handleSubmit = useCallback<MyEmailNewProps["onSubmit"]>(
    async ({ subject, text }) => {
      if (!enabledEmail) {
        openSnackbar(
          <p>
            <Link href={`/${userId}/new`}>
              <a
                style={{
                  color: "#8ab4f8",
                  margin: "0 4px",
                  textDecoration: "underline",
                }}
              >
                メールアドレスを設定
              </a>
            </Link>
            してください
          </p>
        );

        return;
      }

      await axiosInstance.post<
        PostEmailData,
        AxiosResponse<PostEmailData>,
        PostEmailBody
      >("/api/email", {
        collocutorUserId,
        text,
        userId,
        subject: `（${name}）${subject}`,
      });

      openSnackbar("メールを送信しました！");
    },
    [collocutorUserId, enabledEmail, name, openSnackbar, userId]
  );

  useEffect(() => {
    if (enabledEmail) {
      return;
    }

    openSnackbar(
      <p>
        <Link href={`/${userId}/new`}>
          <a
            style={{
              color: "#8ab4f8",
              margin: "0 4px",
              textDecoration: "underline",
            }}
          >
            メールアドレスを設定
          </a>
        </Link>
        してください
      </p>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledEmail]);

  return (
    <>
      <Seo noindex={true} title="メールフォーム" />
      <MyEmailNew
        articleId={articleId}
        collocutorName={collocutorName}
        onSubmit={handleSubmit}
      />
    </>
  );
}

New.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  articleId: string;
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

  const { articleId, userId } = params;

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

  const client = createClient({
    accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN || "",
    space: process.env.CONTENTFUL_SPACE_ID || "",
  });
  const { userId: collocutorUserId } = await client
    .getEntry<Contentful.IArticlesFields>(articleId)
    .then(({ fields: { userId } }) => ({
      userId,
    }));

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

  const { email, name } = data as Firestore.User;

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
    enabledContactEmail: collocutorEnabledContactEmail,
    name: collocutorName,
  } = collocutorData as Firestore.User;

  if (!collocutorEmail || !collocutorEnabledContactEmail) {
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  return {
    props: {
      articleId,
      collocutorUserId,
      userId,
      // 相手の名前
      collocutorName: `${collocutorName}さん`,
      enabledEmail: !!email,
      // 自分の名前
      name: `${name}さん`,
    },
  };
};

export default New;
