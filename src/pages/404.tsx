import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import { ReactElement } from "react";

function Custom404(): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="ページが見つかりません" />
      <div
        style={{
          alignContent: "center",
          alignItems: "center",
          display: "grid",
          gap: "12px",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2>404</h2>
        <p>ページが見つかりません</p>
      </div>
    </>
  );
}

Custom404.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Custom404;
