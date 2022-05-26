import Heading2 from "components/atoms/Heading2";
import Article from "components/molecules/Article";
import ProfileForm, {
  ProfileFormProps,
} from "components/organisms/ProfileForm";
import styles from "./style.module.scss";

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
            <Heading2 text="アカウントを作成しましょう" />
          </div>
        }
      >
        <ProfileForm
          defaultValues={defaultValues}
          isNew={true}
          onSubmit={onSubmit}
        />
      </Article>
    </div>
  );
}

export default ProfileNew;
