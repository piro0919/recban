import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { GetVerifyIdTokenData } from "pages/api/verifyIdToken";

async function middleware(req: NextRequest): Promise<Response> {
  if (
    req.nextUrl.pathname.includes(".") ||
    !req.page.params ||
    !("uid" in req.page.params)
  ) {
    return NextResponse.next();
  }

  const {
    page: {
      params: { uid },
    },
  } = req;

  /*
   * verifyIdToken start
   */
  try {
    const axiosInstance = axios.create({
      adapter: fetchAdapter,
    });
    const {
      data: { idToken, uid: dataUid },
    } = await axiosInstance.get<
      GetVerifyIdTokenData,
      AxiosResponse<GetVerifyIdTokenData>
    >(`${req.nextUrl.origin}/api/verifyIdToken`, {
      headers: {
        cookie: `idToken=${req.cookies.idToken}; refreshToken=${req.cookies.refreshToken}`,
      },
    });

    if (uid !== dataUid) {
      return NextResponse.redirect(`${req.nextUrl.origin}/signout`);
    }

    return NextResponse.next().cookie("idToken", idToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  } catch {
    return NextResponse.redirect(`${req.nextUrl.origin}/signout`);
  }
  /*
   * verifyIdToken end
   */
}

export default middleware;
