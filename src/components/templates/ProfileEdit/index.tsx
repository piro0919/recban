import styles from "./style.module.scss";
import ProfileForm, {
  ProfileFormProps,
} from "components/organisms/ProfileForm";

export type ProfileEditProps = Pick<
  ProfileFormProps,
  "defaultValues" | "onSubmit"
>;

function ProfileEdit({
  defaultValues,
  onSubmit,
}: ProfileEditProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <ProfileForm defaultValues={defaultValues} onSubmit={onSubmit} />
    </div>
  );
}

export default ProfileEdit;
