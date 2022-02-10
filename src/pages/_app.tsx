import "../styles/globals.scss";
import "../styles/nprogress.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "dayjs/locale/ja";
import "ress";
import dayjs from "dayjs";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { ReactElement, ReactNode, useEffect } from "react";
import SnackbarProvider from "react-simple-snackbar";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";

dayjs.locale("ja");

if (process.env.NODE_ENV === "development") {
  require("../styles/show-breakpoints.scss");
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const { user } = useUser();
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string): void => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    const handleStop = (): void => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <SnackbarProvider>
      <UserContext.Provider value={{ user }}>
        {getLayout(<Component {...pageProps} />)}
      </UserContext.Provider>
    </SnackbarProvider>
  );
}

export default MyApp;
