import Footer from "components/organisms/Footer";
import Header from "components/organisms/Header";
import { CSSProperties, ReactNode, useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps): JSX.Element {
  const { height } = useWindowSize();
  const style = useMemo<CSSProperties>(
    () => ({ minHeight: `${height}px` }),
    [height]
  );

  return (
    <>
      <div className={styles.wrapper} style={style}>
        <div className={styles.headerWrapper}>
          <div className={styles.inner}>
            <Header />
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
    </>
  );
}

export default Layout;
