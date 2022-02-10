import { User } from "firebase/auth";
import { createContext } from "react";

export type UserValue = {
  user?: User;
};

const UserContext = createContext<UserValue>({
  user: undefined,
});

export default UserContext;
