import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import { ReactElement } from "react";

function Custom500(): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="サーバー側のエラーが発生しました" />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <h2>500 - サーバー側のエラーが発生しました</h2>
      </div>
    </>
  );
}

Custom500.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Custom500;
