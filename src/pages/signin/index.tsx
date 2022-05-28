import axios, { AxiosResponse } from "axios";
import Layout from "components/templates/Layout";
import Loading from "components/templates/Loading";
import Seo from "components/templates/Seo";
import SignIn, { SignInProps } from "components/templates/SignIn";
import UserContext from "contexts/UserContext";
import { signInWithRedirect } from "firebase/auth";
import useUser from "hooks/useUser";
import auth from "libs/auth";
import googleAuthProvider from "libs/googleAuthProvider";
import twitterAuthProvider from "libs/twitterAuthProvider";
import { useRouter } from "next/router";
import { GetUsersUidData } from "pages/api/users/[uid]";
import { ReactElement, useCallback, useContext, useEffect } from "react";
import { useBoolean } from "usehooks-ts";

function Signin(): JSX.Element {
  const router = useRouter();
  const handleSignInGoogle = useCallback<
    NonNullable<SignInProps["onSignInGoogle"]>
  >(() => {
    signInWithRedirect(auth, googleAuthProvider);
  }, []);
  const handleSignInTwitter = useCallback<
    NonNullable<SignInProps["onSignInTwitter"]>
  >(() => {
    signInWithRedirect(auth, twitterAuthProvider);
  }, []);
  const { userCredential } = useContext(UserContext);
  const { loading, uid } = useUser();
  const {
    setFalse: offIsLoading,
    setTrue: onIsLoading,
    value: isLoading,
  } = useBoolean(false);

  useEffect(() => {
    if (!uid || !userCredential) {
      return;
    }

    onIsLoading();

    axios
      .get<GetUsersUidData, AxiosResponse<GetUsersUidData>>(`/api/users/${uid}`)
      .then(() => {
        router.replace("/");
      })
      .catch(() => {
        router.replace(`/${uid}/new`);
      })
      .finally(() => {
        offIsLoading();
      });
  }, [offIsLoading, onIsLoading, router, uid, userCredential]);

  return (
    <>
      <Seo noindex={true} title="サインイン" />
      <SignIn
        onSignInGoogle={handleSignInGoogle}
        onSignInTwitter={handleSignInTwitter}
      />
      {loading || isLoading ? <Loading /> : null}
    </>
  );
}

Signin.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Signin;
