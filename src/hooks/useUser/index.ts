import auth from "libs/auth";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export type UserData = {
  displayName?: string;
  email?: string;
  loading: boolean;
  photoURL?: string;
  uid?: string;
};

function useUser(): UserData {
  const [user, loading] = useAuthState(auth);
  const { displayName, email, photoURL, uid } = useMemo(() => {
    if (!user) {
      return { displayName: undefined, photoURL: undefined, uid: undefined };
    }

    const { displayName, email, photoURL, uid } = user;

    return {
      uid,
      displayName: displayName || undefined,
      email: email || undefined,
      photoURL: photoURL || undefined,
    };
  }, [user]);

  return {
    displayName,
    email,
    loading,
    photoURL,
    uid,
  };
}

export default useUser;
