import sendgridMail, { ClientResponse } from "@sendgrid/mail";
import { getFirestore } from "firebase-admin/firestore";
import "libs/admin";
import getHandler from "libs/getHandler";

const handler = getHandler<PostEmailBody>();

export type PostEmailBody = {
  collocutorUid?: string;
  subject: string;
  text: string;
  uid: string;
};

type ExtendedPostRequest = {
  body: PostEmailBody;
};

export type PostEmailData = ClientResponse;

type ExtendedPostResponse = {
  json: (body: PostEmailData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body }, res) => {
    const { collocutorUid, subject, text, uid } =
      body as ExtendedPostRequest["body"];
    const db = getFirestore();
    const collectionRef = db.collection("users");
    const userDocRef = collectionRef.doc(uid);
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

    let collocutorUserEmail = "";

    if (collocutorUid) {
      const collocutorUserDocRef = collectionRef.doc(collocutorUid);
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

      const { email } = collocutorUserData as Firestore.User;

      collocutorUserEmail = email;
    } else {
      if (!process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        res.status(404);
        res.end();

        return;
      }

      collocutorUserEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    }

    const { email: userEmail } = userData as Firestore.User;

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
