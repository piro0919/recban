import { createClient, Entry } from "contentful-management";
import apiBase from "middlewares/apiBase";

export type DeleteArticlesArticleIdQuery = {
  articleId: string;
};

export type PutArticlesArticleIdBody = Contentful.IArticlesFields;

export type PutArticlesArticleIdQuery = {
  articleId: string;
};

export type PutArticlesArticleIdData = Entry;

const handler = apiBase<PutArticlesArticleIdBody>();

type ExtendedDeleteRequest = {
  query: DeleteArticlesArticleIdQuery;
};

handler.delete<ExtendedDeleteRequest>(async ({ query: { articleId } }, res) => {
  const client = createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN || "",
  });
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || "");
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT || ""
  );
  const entry = await environment.getEntry(articleId);
  const unpublishedEntry = await entry.unpublish();

  await unpublishedEntry.delete();

  res.status(200);
  res.end();
});

type ExtendedPutRequest = {
  body: PutArticlesArticleIdBody;
  query: PutArticlesArticleIdQuery;
};

type ExtendedPutResponse = {
  json: (body: PutArticlesArticleIdData) => void;
};

handler.put<ExtendedPutRequest, ExtendedPutResponse>(
  async ({ body, query: { articleId } }, res) => {
    const {
      ambition,
      content,
      frequency,
      genres,
      maxAge,
      minAge,
      parts,
      places,
      sex,
      title,
      userId,
    } = body as ExtendedPutRequest["body"];
    const client = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN || "",
    });
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || "");
    const environment = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT || ""
    );
    const entry = await environment.getEntry(articleId, {
      content_type: "articles" as Contentful.CONTENT_TYPE,
    });

    entry.fields = {
      ambition: {
        ja: ambition,
      },
      content: {
        ja: content,
      },
      frequency: {
        ja: frequency,
      },
      genres: {
        ja: genres,
      },
      maxAge: {
        ja: maxAge,
      },
      minAge: {
        ja: minAge,
      },
      parts: {
        ja: parts,
      },
      places: {
        ja: places,
      },
      sex: {
        ja: sex,
      },
      title: {
        ja: title,
      },
      userId: {
        ja: userId,
      },
    };

    const updatedEntry = await entry.update();
    const publishedEntry = await updatedEntry.publish();

    res.status(200);
    res.json(publishedEntry);
    res.end();
  }
);

export default handler;
