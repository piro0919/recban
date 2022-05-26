import { Entry } from "contentful-management";
import getEnvironment from "libs/getEnvironment";
import getHandler from "libs/getHandler";

const handler = getHandler<PostArticlesBody>();

export type PostArticlesBody = Contentful.IArticlesFields;

type ExtendedPostRequest = {
  body: PostArticlesBody;
};

export type PostArticlesData = Entry;

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
      uid,
    } = body as ExtendedPostRequest["body"];
    const environment = await getEnvironment();

    if (!environment) {
      res.status(404);
      res.end();

      return;
    }

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
          uid: {
            ja: uid,
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
