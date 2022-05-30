import { NextSeo, NextSeoProps } from "next-seo";
import { useRouter } from "next/router";
import { useMemo } from "react";

export type SeoProps = Pick<
  NextSeoProps,
  "description" | "noindex" | "title"
> & {
  imageNumber?: number;
  type?: NonNullable<NextSeoProps["openGraph"]>["type"];
};

function Seo({
  description = "最高のバンドメンバーと出会おう！",
  imageNumber,
  noindex,
  title,
  type = "article",
}: SeoProps): JSX.Element {
  const { asPath } = useRouter();
  const images = useMemo(() => {
    const images = Array(6)
      .fill(undefined)
      .map((_, index) => ({
        alt: "りくばん！",
        height: 630,
        type: "image/png",
        url: `https://recban.kk-web.link/og-image-0${index + 1}.png`,
        width: 1200,
      }));

    if (typeof imageNumber === "undefined") {
      return images;
    }

    const image = images.find((_, index) => imageNumber === index);

    return image ? [image] : images;
  }, [imageNumber]);

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
        images,
        type,
        locale: "ja",
        site_name: "りくばん！",
        title: title ? `${title} - りくばん！` : "りくばん！",
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
