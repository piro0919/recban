import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import useUser from "hooks/useUser";
import auth from "libs/auth";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { useBoolean } from "usehooks-ts";

function Signout(): JSX.Element {
  const { uid } = useUser();
  const { setTrue: onIsSignedOut, value: isSignedOut } = useBoolean(false);
  const router = useRouter();

  useEffect(() => {
    auth.signOut().then(() => {
      onIsSignedOut();
    });
  }, [onIsSignedOut]);

  useEffect(() => {
    if (!isSignedOut || uid) {
      return;
    }

    router.replace("/signin");
  }, [router, isSignedOut, uid]);

  return <Seo noindex={true} title="サインアウト" />;
}

Signout.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Signout;
