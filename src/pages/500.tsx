import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import { ReactElement } from "react";

function Custom500(): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="サーバー側のエラーが発生しました" />
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
        <h2>500</h2>
        <p>サーバー側のエラーが発生しました</p>
      </div>
    </>
  );
}

Custom500.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Custom500;
