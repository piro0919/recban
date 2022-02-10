import { getAuth } from "firebase/auth";
import app from "libs/app";

const auth = getAuth(app);

auth.languageCode = "jp";

export default auth;
