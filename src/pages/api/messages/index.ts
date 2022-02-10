import { SaveObjectResponse, SearchResponse } from "@algolia/client-search";
import algoliasearch from "algoliasearch";
import apiBase from "middlewares/apiBase";

export type GetMessagesQuery = {
  filters: string;
  query: string;
};

export type GetMessagesData = SearchResponse<Algolia.Message>;

export type PostMessagesBody = {
  applicantUserId: string;
  articleId: string;
};

export type PostMessagesData = SaveObjectResponse;

const handler = apiBase<GetMessagesData | PostMessagesData>();

type ExtendedGetRequest = {
  query: GetMessagesQuery;
};

type ExtendedGetResponse = {
  json: (body: GetMessagesData) => void;
};

handler.get<ExtendedGetRequest, ExtendedGetResponse>(
  async ({ query: { filters, query } }, res) => {
    const client = algoliasearch(
      process.env.ALGOLIA_APPLICATION_ID || "",
      process.env.ALGOLIA_ADMIN_API_KEY || ""
    );
    const index = client.initIndex(
      process.env.ALGOLIA_MESSAGES_INDEX_NAME || ""
    );
    const searchResponse = await index.search<Algolia.Message>(query, {
      filters,
    });

    res.status(200);
    res.json(searchResponse);
    res.end();
  }
);

type ExtendedPostRequest = {
  body: PostMessagesBody;
};

type ExtendedPostResponse = {
  json: (body: PostMessagesData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body }, res) => {
    const { applicantUserId, articleId } = body as ExtendedPostRequest["body"];
    const client = algoliasearch(
      process.env.ALGOLIA_APPLICATION_ID || "",
      process.env.ALGOLIA_ADMIN_API_KEY || ""
    );
    const index = client.initIndex(
      process.env.ALGOLIA_MESSAGES_INDEX_NAME || ""
    );
    const saveObjectResponse = await index
      .saveObject(
        {
          applicantUserId,
          articleId,
          messages: [],
        },
        {
          autoGenerateObjectIDIfNotExist: true,
        }
      )
      .wait();

    res.status(200);
    res.json(saveObjectResponse);
    res.end();
  }
);

export default handler;
