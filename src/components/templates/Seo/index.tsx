import { NextSeo, NextSeoProps } from "next-seo";
import { useRouter } from "next/router";

export type SeoProps = Pick<
  NextSeoProps,
  "description" | "noindex" | "title"
> & {
  type?: NonNullable<NextSeoProps["openGraph"]>["type"];
};

function Seo({
  description = "最高のバンドメンバーと出会おう！",
  noindex,
  title,
  type = "article",
}: SeoProps): JSX.Element {
  const { asPath } = useRouter();

  return (
    <NextSeo
      additionalLinkTags={[
        {
          href: "/manifest.json",
          rel: "manifest",
        },
      ]}
      canonical="https://recban.kk-web.link/"
      description={description}
      facebook={{
        appId: "5017539104966167",
      }}
      noindex={noindex}
      openGraph={{
        description,
        type,
        images: [
          {
            alt: "りくばん！",
            height: 630,
            type: "image/png",
            url: "https://recban.kk-web.link/og-image-01.png",
            width: 1200,
          },
          {
            alt: "りくばん！",
            height: 630,
            type: "image/png",
            url: "https://recban.kk-web.link/og-image-02.png",
            width: 1200,
          },
          {
            alt: "りくばん！",
            height: 630,
            type: "image/png",
            url: "https://recban.kk-web.link/og-image-03.png",
            width: 1200,
          },
          {
            alt: "りくばん！",
            height: 630,
            type: "image/png",
            url: "https://recban.kk-web.link/og-image-04.png",
            width: 1200,
          },
          {
            alt: "りくばん！",
            height: 630,
            type: "image/png",
            url: "https://recban.kk-web.link/og-image-05.png",
            width: 1200,
          },
          {
            alt: "りくばん！",
            height: 630,
            type: "image/png",
            url: "https://recban.kk-web.link/og-image-06.png",
            width: 1200,
          },
        ],
        locale: "ja",
        site_name: "りくばん！",
        title: `${title} - りくばん！`,
        url: `https://recban.kk-web.link${asPath}`,
      }}
      title={title ? `${title} - りくばん！` : "りくばん！"}
      twitter={{
        cardType: "summary_large_image",
      }}
    />
  );
}

export default Seo;
