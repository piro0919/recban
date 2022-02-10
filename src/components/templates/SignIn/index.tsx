import { ComponentProps } from "react";
import {
  GoogleLoginButton,
  TwitterLoginButton,
} from "react-social-login-buttons";
import styles from "./style.module.scss";

export type SignInProps = {
  onSignInGoogle: ComponentProps<typeof GoogleLoginButton>["onClick"];
  onSignInTwitter: ComponentProps<typeof TwitterLoginButton>["onClick"];
};

function SignIn({ onSignInGoogle, onSignInTwitter }: SignInProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <GoogleLoginButton
        className={styles.button}
        onClick={onSignInGoogle}
        text="Googleでログインする"
      />
      <TwitterLoginButton
        className={styles.button}
        onClick={onSignInTwitter}
        text="Twitterでログインする"
      />
    </div>
  );
}

export default SignIn;
