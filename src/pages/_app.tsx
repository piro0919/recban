import "@djthoms/pretty-checkbox/src/pretty-checkbox.scss";
import NoSSR from "@mpth/react-no-ssr";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import axios, { AxiosResponse } from "axios";
import IosPwaPrompt from "components/templates/IosPwaPrompt";
import PwaContext from "contexts/PwaContext";
import UserContext from "contexts/UserContext";
import { getRedirectResult, UserCredential } from "firebase/auth";
import auth from "libs/auth";
import fetcher from "libs/fetcher";
import infoToast from "libs/infoToast";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import NextNProgress from "nextjs-progressbar";
import { setCookie, destroyCookie } from "nookies";
import queryString from "query-string";
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
import usePwa from "use-pwa";
import { GetArticlesData } from "./api/articles";
import { GetMessagesData } from "./api/messages";

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
  const {
    appinstalled,
    canInstallprompt,
    enabledPwa,
    enabledUpdate,
    isPwa,
    showInstallPrompt,
    unregister,
  } = usePwa();

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

  useEffect(() => {
    const callback = async (): Promise<void> => {
      if (!user) {
        return;
      }

      const { uid } = user;
      const {
        data: { items },
      } = await axios.get<GetArticlesData, AxiosResponse<GetArticlesData>>(
        queryString.stringifyUrl({
          query: {
            uid,
          },
          url: "/api/articles",
        })
      );
      const recruiterMessages = await Promise.all(
        items.map(({ sys: { id } }) =>
          axios.get<GetMessagesData, AxiosResponse<GetMessagesData>>(
            queryString.stringifyUrl({
              query: {
                articleId: id,
                unreadUser: "recruiter",
              },
              url: "/api/messages",
            })
          )
        )
      );
      const {
        data: { total: applicantTotal },
      } = await axios.get<GetMessagesData, AxiosResponse<GetMessagesData>>(
        queryString.stringifyUrl({
          query: {
            applicantUserId: uid,
            unreadUser: "applicant",
          },
          url: "/api/messages",
        })
      );
      const recruiterTotal = recruiterMessages.reduce(
        (previousValue, { data: { total } }) => previousValue + total,
        0
      );
      const total = applicantTotal + recruiterTotal;

      if (!total) {
        return;
      }

      infoToast(`${total} 件の未読メッセージがあります`);
    };

    callback();
  }, [user]);

  usePagesViews();

  return (
    <>
      <Head>
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
        <link href="/manifest.json" rel="manifest" />
        <link href="/logo192.png" rel="apple-touch-icon" />
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
        <PwaContext.Provider
          value={{
            appinstalled,
            canInstallprompt,
            enabledPwa,
            enabledUpdate,
            isPwa,
            showInstallPrompt,
            unregister,
          }}
        >
          <UserContext.Provider value={{ userCredential }}>
            <GoogleAnalytics />
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
                    maxWidth: 480,
                  },
                }}
              />
            </NoSSR>
            <ScrollToTop
              color="#e8eaed"
              style={{
                alignItems: "center",
                background: "#2d2e30",
                boxShadow: "none",
                display: "flex",
                justifyContent: "center",
                opacity: 0.75,
              }}
              width="20"
            />
          </UserContext.Provider>
        </PwaContext.Provider>
      </SWRConfig>
      {user ? <IosPwaPrompt /> : null}
    </>
  );
}

export default MyApp;
