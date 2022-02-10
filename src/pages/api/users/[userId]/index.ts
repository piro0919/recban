import "libs/admin";
import { getFirestore } from "firebase-admin/firestore";
import apiBase from "middlewares/apiBase";

export type GetUsersUserIdQuery = {
  userId: string;
};

export type GetUsersUserIdData = Partial<Firestore.User>;

export type PostUsersUserIdBody = {
  email: string;
  enabledContactEmail: boolean;
  name: string;
  notification: boolean;
  twitterId: string;
};

export type PostUsersUserIdQuery = {
  userId: string;
};

export type PostUsersUserIdData = FirebaseFirestore.WriteResult;

export type PutUsersUserIdBody = {
  email: string;
  enabledContactEmail: boolean;
  name: string;
  notification: boolean;
  twitterId: string;
};

export type PutUsersUserIdQuery = {
  userId: string;
};

export type PutUsersUserIdData = FirebaseFirestore.WriteResult;

const handler = apiBase<
  GetUsersUserIdData | PostUsersUserIdData | PutUsersUserIdData
>();

type ExtendedGetRequest = {
  query: GetUsersUserIdQuery;
};

type ExtendedGetResponse = {
  json: (body: GetUsersUserIdData) => void;
};

handler.get<ExtendedGetRequest, ExtendedGetResponse>(
  async ({ query: { userId } }, res) => {
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const docRef = collectionRef.doc(userId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      res.status(404);
      res.end();

      return;
    }

    const data = snapshot.data();

    if (!data) {
      res.status(404);
      res.end();

      return;
    }

    res.status(200);
    res.json(data as Firestore.User);
    res.end();
  }
);

type ExtendedPostRequest = {
  body: PostUsersUserIdBody;
  query: PostUsersUserIdQuery;
};

type ExtendedPostResponse = {
  json: (body: PostUsersUserIdData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body, query: { userId } }, res) => {
    const { email, enabledContactEmail, name, notification, twitterId } =
      body as PostUsersUserIdBody;
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const docRef = collectionRef.doc(userId);
    const writeResult = await docRef.create({
      email,
      enabledContactEmail,
      name,
      notification,
      twitterId,
    });

    res.status(200);
    res.json(writeResult);
    res.end();
  }
);

type ExtendedPutRequest = {
  body: PutUsersUserIdBody;
  query: PutUsersUserIdQuery;
};

type ExtendedPutResponse = {
  json: (body: PutUsersUserIdData) => void;
};

handler.put<ExtendedPutRequest, ExtendedPutResponse>(
  async ({ body, query: { userId } }, res) => {
    const { email, enabledContactEmail, name, notification, twitterId } =
      body as PutUsersUserIdBody;
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const docRef = collectionRef.doc(userId);
    const writeResult = await docRef.set({
      email,
      enabledContactEmail,
      name,
      notification,
      twitterId,
    });

    res.status(200);
    res.json(writeResult);
    res.end();
  }
);

export default handler;
