import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./style.module.scss";
import Button from "components/atoms/Button";
import Input from "components/atoms/Input";
import Select from "components/atoms/Select";
import useGenres from "hooks/useGenres";
import useParts from "hooks/useParts";
import usePrefectures from "hooks/usePrefectures";

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
  const { handleSubmit, register } = useForm<FieldValues>({
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
            <Select
              {...register("part")}
              options={[
                {
                  label: "",
                  value: "",
                },
                ...parts.map((part) => ({ label: part, value: part })),
              ]}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>ジャンル</span>
            <Select
              {...register("genre")}
              options={[
                {
                  label: "",
                  value: "",
                },
                ...genres.map((genre) => ({ label: genre, value: genre })),
              ]}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>性別</span>
            <Select
              {...register("sex")}
              options={[
                {
                  label: "",
                  value: "",
                },
                {
                  label: "男女問わない",
                  value: "男女問わない",
                },
                {
                  label: "男性のみ",
                  value: "男性のみ",
                },
                {
                  label: "女性のみ",
                  value: "女性のみ",
                },
              ]}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>年齢</span>
            <span className={styles.ageWrapper}>
              <Select
                {...register("age")}
                options={[
                  {
                    label: "",
                    value: "",
                  },
                  ...Array(89)
                    .fill(undefined)
                    .map((_, index) => ({
                      label: index + 12,
                      value: (index + 12).toString(),
                    })),
                ]}
              />
              歳
            </span>
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>活動場所</span>
            <Select
              {...register("place")}
              options={[
                {
                  label: "",
                  value: "",
                },
                ...prefectures.map((prefecture) => ({
                  label: prefecture,
                  value: prefecture,
                })),
              ]}
            />
          </label>
          <label className={styles.label}>
            <span className={styles.label2}>志向性</span>
            <Select
              {...register("ambition")}
              options={[
                {
                  label: "",
                  value: "",
                },
                {
                  label: "アマチュア志向",
                  value: "アマチュア志向",
                },
                {
                  label: "ややアマチュア志向",
                  value: "ややアマチュア志向",
                },
                {
                  label: "ややプロ志向",
                  value: "ややプロ志向",
                },
                {
                  label: "プロ志向",
                  value: "プロ志向",
                },
              ]}
            />
          </label>
        </div>
        <Button type="submit">検索する</Button>
      </div>
    </form>
  );
}

export default SearchForm;
