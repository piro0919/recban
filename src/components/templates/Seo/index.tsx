import { NextSeo, NextSeoProps } from "next-seo";

export type SeoProps = Pick<NextSeoProps, "description" | "noindex" | "title">;

function Seo({ description, noindex, title }: SeoProps): JSX.Element {
  return (
    <NextSeo
      additionalLinkTags={[
        {
          href: "/manifest.json",
          rel: "manifest",
        },
      ]}
      description={description}
      noindex={noindex}
      title={`${title} - りくばん！`}
    />
  );
}

export default Seo;
