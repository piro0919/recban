import AboutTop from "components/templates/AboutTop";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";
import { ReactElement } from "react";

function About(): JSX.Element {
  return (
    <>
      <Seo noindex={false} title="りくばん！について" />
      <AboutTop />
    </>
  );
}

About.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default About;
