declare namespace Firestore {
  type User = {
    email: string;
    enabledContactEmail: boolean;
    name: string;
    notification: boolean;
    twitterId: string;
  };
}
