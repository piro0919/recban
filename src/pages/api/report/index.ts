import "libs/admin";
import sendgridMail, { ClientResponse } from "@sendgrid/mail";
import { getFirestore } from "firebase-admin/firestore";
import apiBase from "middlewares/apiBase";

export type PostReportBody = {
  subject: string;
  text: string;
  userId: string;
};

export type PostReportData = ClientResponse;

const handler = apiBase<PostReportBody>();

type ExtendedPostRequest = {
  body: PostReportBody;
};

type ExtendedPostResponse = {
  json: (body: PostReportData) => void;
};

handler.post<ExtendedPostRequest, ExtendedPostResponse>(
  async ({ body }, res) => {
    const { subject, text, userId } = body as ExtendedPostRequest["body"];
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

    const { email: userEmail } = userData as Firestore.User;

    sendgridMail.setApiKey(process.env.SENDGRID_API_KEY || "");

    const [clientResponse] = await sendgridMail.send({
      text,
      from: userEmail,
      subject: `【りくばん！】${subject}`,
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    });

    res.status(200);
    res.json(clientResponse);
    res.end();
  }
);

export default handler;
