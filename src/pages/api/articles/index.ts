import { createClient, Entry } from "contentful-management";
import apiBase from "middlewares/apiBase";

export type PostArticlesBody = Contentful.IArticlesFields;

export type PostArticlesData = Entry;

const handler = apiBase<PostArticlesBody>();

type ExtendedPostRequest = {
  body: PostArticlesBody;
};

type ExtendedPostResponse = {
  json: (body: PostArticlesData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body }, res) => {
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
    } = body as ExtendedPostRequest["body"];
    const client = createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN || "",
    });
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || "");
    const environment = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT || ""
    );
    const entry = await environment.createEntry(
      "articles" as Contentful.CONTENT_TYPE,
      {
        fields: {
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
        },
      }
    );
    const publishedEntry = await entry.publish();

    res.status(200);
    res.json(publishedEntry);
    res.end();
  }
);

export default handler;
