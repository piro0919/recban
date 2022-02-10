import NoSSR from "@mpth/react-no-ssr";
import { useWindowHeight } from "@react-hook/window-size";
import { CSSProperties, ReactNode, useMemo } from "react";
import styles from "./style.module.scss";
import Footer from "components/organisms/Footer";
import Header, { HeaderProps } from "components/organisms/Header";

export type LayoutProps = Pick<HeaderProps, "hideRecruit"> & {
  children: ReactNode;
};

function Layout({ children, hideRecruit }: LayoutProps): JSX.Element {
  const onlyHeight = useWindowHeight();
  const style = useMemo<CSSProperties>(
    () => ({ minHeight: `${onlyHeight}px` }),
    [onlyHeight]
  );

  return (
    <NoSSR>
      <div className={styles.wrapper} style={style}>
        <div className={styles.headerWrapper}>
          <div className={styles.inner}>
            <Header hideRecruit={hideRecruit} />
          </div>
        </div>
        <main className={styles.main}>
          <div className={styles.inner}>{children}</div>
        </main>
        <div className={styles.footerWrapper}>
          <div className={styles.inner}>
            <Footer />
          </div>
        </div>
      </div>
    </NoSSR>
  );
}

export default Layout;
