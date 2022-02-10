/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty */
import axios from "axios";
import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { parseCookies, setCookie } from "nookies";

const verifyIdToken = nc<NextApiRequest, NextApiResponse>().use(
  async (req, res, next) => {
    const { idToken, refreshToken } = parseCookies({ req });
    const { userId } = req as Record<string, any>;

    (req as Record<string, any>).userId = undefined;

    try {
      const { uid } = await admin.auth().verifyIdToken(idToken);

      if (!userId || userId === uid) {
        next();

        return;
      }

      console.log(userId, uid);
    } catch {}

    try {
      const {
        data: { id_token: newIdToken, user_id: newUserId },
      } = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }
      );

      if (!userId || userId === newUserId) {
        setCookie({ res }, "idToken", newIdToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "Lax",
        });

        next();

        return;
      }
    } catch {}

    throw new Error();
  }
);

export default verifyIdToken;
