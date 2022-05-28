import Button from "components/atoms/Button";
import Input from "components/atoms/Input";
import Select from "components/atoms/Select";
import useGenres from "hooks/useGenres";
import useParts from "hooks/useParts";
import usePrefectures from "hooks/usePrefectures";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "./style.module.scss";

type FieldValues = {
  age: string;
  ambition: string;
  genre: string;
  part: string;
  place: string;
  query: string;
  sex: string;
};

export type SearchFormProps = {
  defaultValues: FieldValues;
  onSubmit: SubmitHandler<FieldValues>;
};

function SearchForm({ defaultValues, onSubmit }: SearchFormProps): JSX.Element {
  const genres = useGenres();
  const parts = useParts();
  const prefectures = usePrefectures();
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<FieldValues>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formInner}>
        <div className={styles.fieldsWrapper}>
          <label className={styles.label}>
            <span className={styles.label2}>検索ワード</span>
            <div className={styles.inputWrapper}>
              <Input {...register("query")} />
            </div>
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>募集パート</span>
            <Controller
              control={control}
              name="part"
              render={({ field: { name, ref, value } }): JSX.Element => (
                <Select
                  onChange={({ value }): void => {
                    setValue(name, value);
                  }}
                  options={["", ...parts]}
                  ref={ref}
                  value={value}
                />
              )}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>ジャンル</span>
            <Controller
              control={control}
              name="genre"
              render={({ field: { name, ref, value } }): JSX.Element => (
                <Select
                  onChange={({ value }): void => {
                    setValue(name, value);
                  }}
                  options={["", ...genres]}
                  ref={ref}
                  value={value}
                />
              )}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>性別</span>
            <Controller
              control={control}
              name="sex"
              render={({ field: { name, ref, value } }): JSX.Element => (
                <Select
                  onChange={({ value }): void => {
                    setValue(name, value);
                  }}
                  options={["", "男女問わない", "男性のみ", "女性のみ"]}
                  ref={ref}
                  value={value}
                />
              )}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>年齢</span>
            <span className={styles.ageWrapper}>
              <Controller
                control={control}
                name="age"
                render={({ field: { name, ref, value } }): JSX.Element => (
                  <Select
                    onChange={({ value }): void => {
                      setValue(name, value);
                    }}
                    options={[
                      "",
                      ...Array(89)
                        .fill(undefined)
                        .map((_, index) => (index + 12).toString()),
                    ]}
                    ref={ref}
                    value={value}
                  />
                )}
              />
              歳
            </span>
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>活動場所</span>
            <Controller
              control={control}
              name="place"
              render={({ field: { name, ref, value } }): JSX.Element => (
                <Select
                  onChange={({ value }): void => {
                    setValue(name, value);
                  }}
                  options={[
                    "",
                    ...prefectures.flatMap(({ prefectures }) => prefectures),
                  ]}
                  ref={ref}
                  value={value}
                />
              )}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>志向性</span>
            <Controller
              control={control}
              name="ambition"
              render={({ field: { name, ref, value } }): JSX.Element => (
                <Select
                  onChange={({ value }): void => {
                    setValue(name, value);
                  }}
                  options={[
                    "",
                    "アマチュア志向",
                    "ややアマチュア志向",
                    "ややプロ志向",
                    "プロ志向",
                  ]}
                  ref={ref}
                  value={value}
                />
              )}
            />
          </label>
        </div>
        <Button disabled={isSubmitting} type="submit">
          検索する
        </Button>
      </div>
    </form>
  );
}

export default SearchForm;
