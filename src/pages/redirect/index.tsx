import { AxiosResponse } from "axios";
import { getRedirectResult, UserCredential } from "firebase/auth";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect, useState } from "react";
import Layout from "components/templates/Layout";
import RedirectTop from "components/templates/RedirectTop";
import Seo from "components/templates/Seo";
import UserContext from "contexts/UserContext";
import auth from "libs/auth";
import axiosInstance from "libs/axiosInstance";
import { GetUsersUserIdData } from "pages/api/users/[userId]";

function Redirect(): JSX.Element {
  const router = useRouter();
  const [result, setResult] = useState<UserCredential>();
  const { user } = useContext(UserContext);

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (!result) {
        return;
      }

      setResult(result);
    });
  }, []);

  useEffect(() => {
    if (!result || !user) {
      return;
    }

    const { uid } = user;

    axiosInstance
      .get<GetUsersUserIdData, AxiosResponse<GetUsersUserIdData>>(
        `/api/users/${uid}`
      )
      .then(() => {
        router.replace("/");
      })
      .catch(() => {
        router.replace(`/${uid}/new`);
      });
  }, [result, router, user]);

  return (
    <>
      <Seo noindex={true} title="リダイレクト" />
      <RedirectTop />
    </>
  );
}

Redirect.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout hideRecruit={true}>{page}</Layout>;
};

export default Redirect;
