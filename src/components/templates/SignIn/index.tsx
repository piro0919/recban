import { ComponentProps } from "react";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  TwitterLoginButton,
} from "react-social-login-buttons";
import styles from "./style.module.scss";

export type SignInProps = {
  onSignInFacebook: ComponentProps<typeof FacebookLoginButton>["onClick"];
  onSignInGoogle: ComponentProps<typeof GoogleLoginButton>["onClick"];
  onSignInTwitter: ComponentProps<typeof TwitterLoginButton>["onClick"];
};

function SignIn({
  onSignInFacebook,
  onSignInGoogle,
  onSignInTwitter,
}: SignInProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <GoogleLoginButton
        align="center"
        className={styles.button}
        onClick={onSignInGoogle}
        text="Googleでログインする"
      />
      <TwitterLoginButton
        align="center"
        className={styles.button}
        onClick={onSignInTwitter}
        text="Twitterでログインする"
      />
      <FacebookLoginButton
        align="center"
        className={styles.button}
        onClick={onSignInFacebook}
        text="Facebookでログインする"
      />
    </div>
  );
}

export default SignIn;
