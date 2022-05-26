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

  useEffect(() => {
    if (!uid || !userCredential) {
      return;
    }

    axios
      .get<GetUsersUidData, AxiosResponse<GetUsersUidData>>(`/api/users/${uid}`)
      .then(async () => {
        await router.replace("/");
      })
      .catch(async () => {
        await router.replace(`/${uid}/new`);
      });
  }, [router, uid, userCredential]);

  return (
    <>
      <Seo noindex={true} title="サインイン" />
      <SignIn
        onSignInGoogle={handleSignInGoogle}
        onSignInTwitter={handleSignInTwitter}
      />
      {loading ? <Loading /> : null}
    </>
  );
}

Signin.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Signin;
