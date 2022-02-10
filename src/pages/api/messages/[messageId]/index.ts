import {
  ObjectWithObjectID,
  PartialUpdateObjectResponse,
} from "@algolia/client-search";
import algoliasearch from "algoliasearch";
import apiBase from "middlewares/apiBase";

export type GetMessagesMessageIdQuery = {
  attributesToRetrieve?: string | string[];
  messageId: string;
};

export type GetMessagesMessageIdData = Algolia.Message & ObjectWithObjectID;

type Message = {
  content: string;
  date: string;
  user: "applicant" | "recruiter";
};

export type PatchMessagesMessageIdBody = {
  messages: Message[];
};

export type PatchMessagesMessageIdQuery = {
  messageId: string;
};

export type PatchMessagesMessageIdData = PartialUpdateObjectResponse;

const handler = apiBase<PatchMessagesMessageIdBody>();

type ExtendedGetRequest = {
  query: GetMessagesMessageIdQuery;
};

type ExtendedGetResponse = {
  json: (body: GetMessagesMessageIdData) => void;
};

handler.get<ExtendedGetRequest, ExtendedGetResponse>(
  async ({ query: { attributesToRetrieve, messageId } }, res) => {
    const client = algoliasearch(
      process.env.ALGOLIA_APPLICATION_ID || "",
      process.env.ALGOLIA_ADMIN_API_KEY || ""
    );
    const index = client.initIndex("dev_MESSAGES");
    const messageWithObjectID = await index.getObject<Algolia.Message>(
      messageId,
      {
        attributesToRetrieve: Array.isArray(attributesToRetrieve)
          ? attributesToRetrieve
          : [attributesToRetrieve || ""],
      }
    );

    res.status(200);
    res.json(messageWithObjectID);
    res.end();
  }
);

type ExtendedPatchRequest = {
  body: PatchMessagesMessageIdBody;
  query: PatchMessagesMessageIdQuery;
};

type ExtendedPatchResponse = {
  json: (body: PatchMessagesMessageIdData) => void;
};

handler.patch<ExtendedPatchRequest, ExtendedPatchResponse>(
  async ({ body, query: { messageId } }, res) => {
    const { messages } = body as ExtendedPatchRequest["body"];
    const client = algoliasearch(
      process.env.ALGOLIA_APPLICATION_ID || "",
      process.env.ALGOLIA_ADMIN_API_KEY || ""
    );
    const index = client.initIndex("dev_MESSAGES");
    const partialUpdateObjectResponse = await index
      .partialUpdateObject({ messages, objectID: messageId })
      .wait();

    res.status(200);
    res.json(partialUpdateObjectResponse);
    res.end();
  }
);

export default handler;
