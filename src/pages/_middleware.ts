import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import axios, { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { GetVerifyIdTokenData } from "pages/api/verifyIdToken";

async function middleware(req: NextRequest): Promise<Response> {
  if (req.nextUrl.pathname.includes(".")) {
    return NextResponse.next();
  }

  const regex = new RegExp("/articles/.+$");

  /*
   * verifyIdToken end
   */
  if (
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/about" &&
    req.nextUrl.pathname !== "/signin" &&
    req.nextUrl.pathname !== "/signout" &&
    !req.nextUrl.pathname.startsWith("/api") &&
    !regex.test(req.nextUrl.pathname)
  ) {
    try {
      const axiosInstance = axios.create({
        adapter: fetchAdapter,
      });
      const {
        data: { idToken },
      } = await axiosInstance.get<
        GetVerifyIdTokenData,
        AxiosResponse<GetVerifyIdTokenData>
      >(`${req.nextUrl.origin}/api/verifyIdToken`, {
        headers: {
          cookie: `idToken=${req.cookies.idToken}; refreshToken=${req.cookies.refreshToken}`,
        },
      });

      return NextResponse.next().cookie("idToken", idToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
    } catch {
      return NextResponse.redirect(`${req.nextUrl.origin}/signout`);
    }
  }
  /*
   * verifyIdToken end
   */

  return NextResponse.next();
}

export default middleware;
