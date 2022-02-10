import { User } from "firebase/auth";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";
import auth from "libs/auth";

export type UserData = { user?: User };

// _app.ts 以外で import しないこと
// user は UserContext を介して取得するように
function useUser(): UserData {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        const { refreshToken } = user;

        setCookie(null, "idToken", idToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "Lax",
        });
        setCookie(null, "refreshToken", refreshToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          sameSite: "Lax",
        });

        setUser(user);

        return;
      }

      destroyCookie(null, "idToken", { path: "/" });
      destroyCookie(null, "refreshToken", { path: "/" });

      setUser(undefined);
    });

    return (): void => {
      unsubscribe();
    };
  }, []);

  return { user };
}

export default useUser;
