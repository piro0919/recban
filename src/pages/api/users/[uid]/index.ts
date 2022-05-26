import { getFirestore } from "firebase-admin/firestore";
import "libs/admin";
import getHandler from "libs/getHandler";

const handler = getHandler<
  GetUsersUidData | PostUsersUidData | PutUsersUidData
>();

export type GetUsersUidQuery = {
  uid: string;
};

type ExtendedGetRequest = {
  query: GetUsersUidQuery;
};

export type GetUsersUidData = Partial<Firestore.User>;

type ExtendedGetResponse = {
  json: (body: GetUsersUidData) => void;
};

handler.get<ExtendedGetRequest, ExtendedGetResponse>(
  async ({ query: { uid } }, res) => {
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const docRef = collectionRef.doc(uid);
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

export type PostUsersUidBody = {
  email: string;
  enabledContactEmail: boolean;
  name: string;
  notification: boolean;
  twitterId: string;
};

export type PostUsersUidQuery = {
  uid: string;
};

type ExtendedPostRequest = {
  body: PostUsersUidBody;
  query: PostUsersUidQuery;
};

export type PostUsersUidData = FirebaseFirestore.WriteResult;

type ExtendedPostResponse = {
  json: (body: PostUsersUidData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body, query: { uid } }, res) => {
    const { email, enabledContactEmail, name, notification, twitterId } =
      body as PostUsersUidBody;
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const docRef = collectionRef.doc(uid);
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

export type PutUsersUidBody = {
  email: string;
  enabledContactEmail: boolean;
  name: string;
  notification: boolean;
  twitterId: string;
};

export type PutUsersUidQuery = {
  uid: string;
};

type ExtendedPutRequest = {
  body: PutUsersUidBody;
  query: PutUsersUidQuery;
};

export type PutUsersUidData = FirebaseFirestore.WriteResult;

type ExtendedPutResponse = {
  json: (body: PutUsersUidData) => void;
};

handler.put<ExtendedPutRequest, ExtendedPutResponse>(
  async ({ body, query: { uid } }, res) => {
    const { email, enabledContactEmail, name, notification, twitterId } =
      body as PutUsersUidBody;
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const docRef = collectionRef.doc(uid);
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
