import { UserCredential } from "firebase/auth";
import { createContext } from "react";

export type UserValue = {
  userCredential?: UserCredential;
};

const UserContext = createContext<UserValue>({
  userCredential: undefined,
});

export default UserContext;
