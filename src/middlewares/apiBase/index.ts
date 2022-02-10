import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextConnect } from "next-connect";
import verifyIdToken from "middlewares/verifyIdToken";

function apiBase<T>(): NextConnect<NextApiRequest, NextApiResponse<T>> {
  return nc<NextApiRequest, NextApiResponse<T>>({
    onError: (err, _, res) => {
      console.error(err.stack);

      res.status(500);
      res.end("Something broke!");
    },
    onNoMatch: (_, res) => {
      res.status(404);
      res.end("Page is not found");
    },
  }).use(verifyIdToken);
}

export default apiBase;
