import styles from "./style.module.scss";
import Heading2 from "components/atoms/Heading2";
import Article from "components/molecules/Article";
import ProfileForm, {
  ProfileFormProps,
} from "components/organisms/ProfileForm";

export type ProfileNewProps = Pick<
  ProfileFormProps,
  "defaultValues" | "onSubmit"
>;

function ProfileNew({ defaultValues, onSubmit }: ProfileNewProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <Article
        heading={
          <div className={styles.heading2Wrapper}>
            <Heading2>アカウントを作成しましょう</Heading2>
          </div>
        }
      >
        <ProfileForm defaultValues={defaultValues} onSubmit={onSubmit} />
      </Article>
    </div>
  );
}

export default ProfileNew;
