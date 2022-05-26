import { Entry } from "contentful";
import { Entry as ManagementEntry } from "contentful-management";
import getClient from "libs/getClient";
import getEnvironment from "libs/getEnvironment";
import getHandler from "libs/getHandler";

const handler = getHandler<
  | DeleteMessagesMessageIdData
  | GetMessagesMessageIdData
  | PutMessagesMessageIdData
>();

export type DeleteMessagesMessageIdQuery = {
  messageId: string;
};

type ExtendedDeleteRequest = {
  query: DeleteMessagesMessageIdQuery;
};

export type DeleteMessagesMessageIdData = ManagementEntry;

type ExtendedDeleteResponse = {
  json: (body: DeleteMessagesMessageIdData) => void;
};

handler.delete<ExtendedDeleteRequest, ExtendedDeleteResponse>(
  async ({ query: { messageId } }, res) => {
    const environment = await getEnvironment();

    if (!environment) {
      res.status(404);
      res.end();

      return;
    }

    const entry = await environment.getEntry(messageId);
    const unpublishedEntry = await entry.unpublish();

    await unpublishedEntry.delete();

    res.status(200);
    res.json(unpublishedEntry);
    res.end();
  }
);

export type GetMessagesMessageIdQuery = {
  messageId: string;
};

type ExtendedGetRequest = {
  query: GetMessagesMessageIdQuery;
};

export type GetMessagesMessageIdData = Entry<Contentful.IMessagesFields>;

type ExtendedGetResponse = {
  json: (body: GetMessagesMessageIdData) => void;
};

handler.get<ExtendedGetRequest, ExtendedGetResponse>(
  async ({ query: { messageId } }, res) => {
    const client = getClient();

    if (!client) {
      res.status(404);
      res.end();

      return;
    }

    const entry = await client.getEntry<Contentful.IMessagesFields>(messageId);

    res.status(200);
    res.json(entry);
    res.end();
  }
);

export type PutMessagesMessageIdBody = Contentful.IMessagesFields;

export type PutMessagesMessageIdQuery = {
  messageId: string;
};

type ExtendedPutRequest = {
  body: PutMessagesMessageIdBody;
  query: PutMessagesMessageIdQuery;
};

export type PutMessagesMessageIdData = ManagementEntry;

type ExtendedPutResponse = {
  json: (body: PutMessagesMessageIdData) => void;
};

handler.put<ExtendedPutRequest, ExtendedPutResponse>(
  async ({ body, query: { messageId } }, res) => {
    const environment = await getEnvironment();

    if (!environment) {
      res.status(404);
      res.end();

      return;
    }

    const { applicantUid, articleId, messages, unreadUser } =
      body as ExtendedPutRequest["body"];
    const entry = await environment.getEntry(messageId, {
      content_type: "messages" as Contentful.CONTENT_TYPE,
    });

    entry.fields = {
      applicantUid: {
        ja: applicantUid,
      },
      articleId: {
        ja: articleId,
      },
      messages: {
        ja: messages,
      },
      unreadUser: {
        ja: unreadUser,
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
