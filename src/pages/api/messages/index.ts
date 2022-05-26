import { EntryCollection } from "contentful";
import { Entry } from "contentful-management";
import getClient from "libs/getClient";
import getEnvironment from "libs/getEnvironment";
import getHandler from "libs/getHandler";

const handler = getHandler<GetMessagesData | PostMessagesData>();

export type GetMessagesQuery = {
  applicantUserId?: string;
  articleId: string;
};

type ExtendedGetRequest = {
  query: GetMessagesQuery;
};

export type GetMessagesData = EntryCollection<Contentful.IMessages>;

type ExtendedGetResponse = {
  json: (body: GetMessagesData) => void;
};

handler.get<ExtendedGetRequest, ExtendedGetResponse>(
  async ({ query: { applicantUserId, articleId } }, res) => {
    const client = getClient();

    if (!client) {
      res.status(404);
      res.end();

      return;
    }

    const entryCollection = await client.getEntries<Contentful.IMessages>({
      content_type: "messages" as Contentful.CONTENT_TYPE,
      "fields.applicantUid": applicantUserId,
      "fields.articleId": articleId,
    });

    res.status(200);
    res.json(entryCollection);
    res.end();
  }
);

export type PostMessagesBody = Contentful.IMessagesFields;

type ExtendedPostRequest = {
  body: PostMessagesBody;
};

export type PostMessagesData = Entry;

type ExtendedPostResponse = {
  json: (body: PostMessagesData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body }, res) => {
    const environment = await getEnvironment();

    if (!environment) {
      res.status(404);
      res.end();

      return;
    }

    const { applicantUid, articleId, messages } =
      body as ExtendedPostRequest["body"];
    const entry = await environment.createEntry(
      "messages" as Contentful.CONTENT_TYPE,
      {
        fields: {
          applicantUid: {
            ja: applicantUid,
          },
          articleId: {
            ja: articleId,
          },
          messages: {
            ja: messages,
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
