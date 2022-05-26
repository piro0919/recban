import ProfileForm, {
  ProfileFormProps,
} from "components/organisms/ProfileForm";
import styles from "./style.module.scss";

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
      <ProfileForm
        defaultValues={defaultValues}
        isNew={false}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ProfileEdit;
