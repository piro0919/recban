import "@djthoms/pretty-checkbox/src/pretty-checkbox.scss";
import NoSSR from "@mpth/react-no-ssr";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserContext from "contexts/UserContext";
import { getRedirectResult, UserCredential } from "firebase/auth";
import auth from "libs/auth";
import fetcher from "libs/fetcher";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { setCookie, destroyCookie } from "nookies";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import "react-dropdown/style.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "react-scroll-to-top";
import "ress";
import "styles/globals.scss";
import "styles/mq-settings.scss";
import "swiper/scss";
import "swiper/scss/lazy";
import { SWRConfig } from "swr";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);
  const [userCredential, setUserCredential] = useState<UserCredential>();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => {
        const { refreshToken } = user;

        setCookie(null, "idToken", idToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "Lax",
        });
        setCookie(null, "refreshToken", refreshToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "Lax",
        });
      });

      return;
    }

    destroyCookie(null, "idToken", { path: "/" });
    destroyCookie(null, "refreshToken", { path: "/" });
  }, [user]);

  useEffect(() => {
    getRedirectResult(auth).then((userCredential) => {
      if (!userCredential) {
        return;
      }

      setUserCredential(userCredential);
    });
  }, []);

  return (
    <>
      <Head>
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
        <link href="/manifest.json" rel="manifest" />
        <link href="logo192.png" rel="apple-touch-icon" />
      </Head>
      <SWRConfig
        value={{
          fetcher,
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnMount: true,
          revalidateOnReconnect: false,
        }}
      >
        <UserContext.Provider value={{ userCredential }}>
          {getLayout(<Component {...pageProps} />)}
          <NextNProgress />
          <NoSSR>
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#2d2e30",
                  color: "#e8eaed",
                  maxWidth: 400,
                },
              }}
            />
          </NoSSR>
          <ScrollToTop
            color="#e8eaed"
            style={{
              background: "#2d2e30",
              boxShadow: "none",
              opacity: 0.75,
            }}
            width="20"
          />
        </UserContext.Provider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
