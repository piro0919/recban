import { EntryCollection } from "contentful";
import { Entry } from "contentful-management";
import getClient from "libs/getClient";
import getEnvironment from "libs/getEnvironment";
import getHandler from "libs/getHandler";

const handler = getHandler<GetArticlesData | PostArticlesData>();

export type GetArticlesQuery = {
  uid: string;
};

type ExtendedGetRequest = {
  query: GetArticlesQuery;
};

export type GetArticlesData = EntryCollection<Contentful.IArticles>;

type ExtendedGetResponse = {
  json: (body: GetArticlesData) => void;
};

handler.get<ExtendedGetRequest, ExtendedGetResponse>(
  async ({ query: { uid } }, res) => {
    const client = getClient();

    if (!client) {
      res.status(404);
      res.end();

      return;
    }

    const entryCollection = await client.getEntries<Contentful.IArticles>({
      content_type: "articles" as Contentful.CONTENT_TYPE,
      "fields.uid": uid,
    });

    res.status(200);
    res.json(entryCollection);
    res.end();
  }
);

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
