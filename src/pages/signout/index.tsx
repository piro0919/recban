import { useRouter } from "next/router";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import UserContext from "contexts/UserContext";
import auth from "libs/auth";

function Signout(): JSX.Element {
  const { user } = useContext(UserContext);
  const [isSignedOut, setIsSignedOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    auth.signOut().then(() => {
      setIsSignedOut(true);
    });
  }, []);

  useEffect(() => {
    if (!isSignedOut || user) {
      return;
    }

    router.push("/");
  }, [router, isSignedOut, user]);

  return <Seo noindex={true} title="サインアウト" />;
}

Signout.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout hideRecruit={true}>{page}</Layout>;
};

export default Signout;
