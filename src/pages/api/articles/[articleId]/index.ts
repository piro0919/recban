import { Entry } from "contentful-management";
import getEnvironment from "libs/getEnvironment";
import getHandler from "libs/getHandler";

const handler = getHandler<
  DeleteArticlesArticleIdData | PutArticlesArticleIdData
>();

export type DeleteArticlesArticleIdQuery = {
  articleId: string;
};

type ExtendedDeleteRequest = {
  query: DeleteArticlesArticleIdQuery;
};

export type DeleteArticlesArticleIdData = Entry;

type ExtendedDeleteResponse = {
  json: (body: DeleteArticlesArticleIdData) => void;
};

handler.delete<ExtendedDeleteRequest, ExtendedDeleteResponse>(
  async ({ query: { articleId } }, res) => {
    const environment = await getEnvironment();

    if (!environment) {
      res.status(404);
      res.end();

      return;
    }

    const entry = await environment.getEntry(articleId);
    const unpublishedEntry = await entry.unpublish();

    await unpublishedEntry.delete();

    res.status(200);
    res.json(unpublishedEntry);
    res.end();
  }
);

export type PutArticlesArticleIdBody = Contentful.IArticlesFields;

export type PutArticlesArticleIdQuery = {
  articleId: string;
};

type ExtendedPutRequest = {
  body: PutArticlesArticleIdBody;
  query: PutArticlesArticleIdQuery;
};

export type PutArticlesArticleIdData = Entry;

type ExtendedPutResponse = {
  json: (body: PutArticlesArticleIdData) => void;
};

handler.put<ExtendedPutRequest, ExtendedPutResponse>(
  async ({ body, query: { articleId } }, res) => {
    const environment = await getEnvironment();

    if (!environment) {
      res.status(404);
      res.end();

      return;
    }

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
    } = body as ExtendedPutRequest["body"];
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
      uid: {
        ja: uid,
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
