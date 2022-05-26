import axios from "axios";
import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import "libs/admin";
import getHandler from "libs/getHandler";
import { parseCookies, setCookie } from "nookies";

const handler = getHandler<GetVerifyIdTokenData>();

export type GetVerifyIdTokenData = DecodedIdToken & {
  idToken: string;
};

type ExtendedGetResponse = {
  json: (body: GetVerifyIdTokenData) => void;
};

handler.get<Record<string, never>, ExtendedGetResponse>(async (req, res) => {
  const { idToken, refreshToken } = parseCookies({ req });

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);

    res.status(200);
    res.json({ ...decodedIdToken, idToken });
    res.end();
  } catch {
    const {
      data: { id_token: newIdToken },
    } = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }
    );
    const decodedIdToken = await admin.auth().verifyIdToken(newIdToken);

    setCookie({ res }, "idToken", newIdToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    res.status(200);
    res.json({ ...decodedIdToken, idToken: newIdToken });
    res.end();
  }
});

export default handler;
