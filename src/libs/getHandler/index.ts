import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import nc, { NextConnect } from "next-connect";

function getHandler<T>(): NextConnect<
  NextApiRequest | IncomingMessage,
  NextApiResponse<T>
> {
  return nc<NextApiRequest | IncomingMessage, NextApiResponse<T>>({
    onError: (err, _, res) => {
      console.error(err.stack);

      res.status(500);
      res.end("Something broke!");
    },
    onNoMatch: (_, res) => {
      res.status(404);
      res.end("Page is not found");
    },
  });
}

export default getHandler;
