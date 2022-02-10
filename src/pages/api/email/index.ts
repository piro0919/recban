import "libs/admin";
import sendgridMail, { ClientResponse } from "@sendgrid/mail";
import { getFirestore } from "firebase-admin/firestore";
import apiBase from "middlewares/apiBase";

export type PostEmailBody = {
  collocutorUserId: string;
  subject: string;
  text: string;
  userId: string;
};

export type PostEmailData = ClientResponse;

const handler = apiBase<PostEmailBody>();

type ExtendedPostRequest = {
  body: PostEmailBody;
};

type ExtendedPostResponse = {
  json: (body: PostEmailData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body }, res) => {
    const { collocutorUserId, subject, text, userId } =
      body as ExtendedPostRequest["body"];
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const userDocRef = collectionRef.doc(userId);
    const userSnapshot = await userDocRef.get();

    if (!userSnapshot.exists) {
      res.status(404);
      res.end();

      return;
    }

    const userData = userSnapshot.data();

    if (!userData) {
      res.status(404);
      res.end();

      return;
    }

    const collocutorUserDocRef = collectionRef.doc(collocutorUserId);
    const collocutorUserSnapshot = await collocutorUserDocRef.get();

    if (!collocutorUserSnapshot.exists) {
      res.status(404);
      res.end();

      return;
    }

    const collocutorUserData = collocutorUserSnapshot.data();

    if (!collocutorUserData) {
      res.status(404);
      res.end();

      return;
    }

    const { email: userEmail } = userData as Firestore.User;
    const { email: collocutorUserEmail } = collocutorUserData as Firestore.User;

    sendgridMail.setApiKey(process.env.SENDGRID_API_KEY || "");

    const [clientResponse] = await sendgridMail.send({
      text,
      from: userEmail,
      subject: `【りくばん！】${subject}`,
      to: collocutorUserEmail,
    });

    res.status(200);
    res.json(clientResponse);
    res.end();
  }
);

export default handler;
