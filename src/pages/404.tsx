import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import { ReactElement } from "react";

function Custom404(): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="ページが見つかりません" />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <h2>404 - ページが見つかりません</h2>
      </div>
    </>
  );
}

Custom404.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Custom404;
