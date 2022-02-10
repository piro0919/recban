import { signInWithRedirect } from "firebase/auth";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useEffect } from "react";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import SignIn, { SignInProps } from "components/templates/SignIn";
import auth from "libs/auth";
import googleAuthProvider from "libs/googleAuthProvider";
import twitterAuthProvider from "libs/twitterAuthProvider";

function Signin(): JSX.Element {
  const router = useRouter();
  const handleSignInGoogle = useCallback<
    NonNullable<SignInProps["onSignInGoogle"]>
  >(() => {
    sessionStorage.setItem("signIn", "true");

    signInWithRedirect(auth, googleAuthProvider);
  }, []);
  const handleSignInTwitter = useCallback<
    NonNullable<SignInProps["onSignInTwitter"]>
  >(() => {
    sessionStorage.setItem("signIn", "true");

    signInWithRedirect(auth, twitterAuthProvider);
  }, []);

  useEffect(() => {
    const callback = async (): Promise<void> => {
      const signIn = sessionStorage.getItem("signIn");

      if (!signIn) {
        return;
      }

      sessionStorage.removeItem("signIn");

      await router.push("/redirect");
    };

    callback();
  }, [router]);

  return (
    <>
      <Seo noindex={true} title="サインイン" />
      <SignIn
        onSignInGoogle={handleSignInGoogle}
        onSignInTwitter={handleSignInTwitter}
      />
    </>
  );
}

Signin.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout hideRecruit={true}>{page}</Layout>;
};

export default Signin;
