import { TwitterAuthProvider } from "firebase/auth";

const twitterAuthProvider = new TwitterAuthProvider();

twitterAuthProvider.setCustomParameters({
  lang: "jp",
});

export default twitterAuthProvider;
