import { IncomingMessage, ServerResponse } from "http";
import nc, { NextConnect } from "next-connect";
import verifyIdToken from "middlewares/verifyIdToken";

function base(): NextConnect<IncomingMessage, ServerResponse> {
  return nc<IncomingMessage, ServerResponse>().use(verifyIdToken);
}

export default base;
