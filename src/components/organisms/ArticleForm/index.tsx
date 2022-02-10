import { yupResolver } from "@hookform/resolvers/yup";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import styles from "./style.module.scss";
import Button from "components/atoms/Button";
import HorizontalRule from "components/atoms/HorizontalRule";
import Input from "components/atoms/Input";
import Select from "components/atoms/Select";
import Textarea from "components/atoms/Textarea";
import useGenres from "hooks/useGenres";
import useParts from "hooks/useParts";
import usePrefectures from "hooks/usePrefectures";

type FieldValues = {
  ambition: string;
  content: string;
  frequency: string;
  genres: string[];
  maxAge: string;
  minAge: string;
  parts: string[];
  places: string[];
  sex: string;
  title: string;
};

const schema = yup.object().shape({
  ambition: yup.string().trim().required("志向性を選択してください"),
  content: yup.string().trim().required("募集内容を入力してください"),
  frequency: yup.string().trim().required("活動頻度を入力してください"),
  genres: yup
    .array()
    .max(3, "ジャンルは3つ以内で選択してください")
    .min(1, "ジャンルを1つ以上選択してください"),
  maxAge: yup.string().trim().required("最大年齢を選択してください"),
  minAge: yup.string().trim().required("最小年齢を選択してください"),
  parts: yup
    .array()
    .max(3, "募集パートは3つ以内で選択してください")
    .min(1, "募集パートを1つ以上選択してください"),
  places: yup
    .array()
    .max(3, "活動場所は3つ以内で選択してください")
    .min(1, "活動場所を1つ以上選択してください"),
  sex: yup.string().trim().required("性別を選択してください"),
  title: yup.string().trim().required("タイトルを入力してください"),
});

export type ArticleFormProps = {
  articleId?: string;
  defaultValues?: FieldValues;
  onSubmit: SubmitHandler<FieldValues>;
};

function ArticleForm({
  articleId,
  defaultValues,
  onSubmit,
}: ArticleFormProps): JSX.Element {
  const genres = useGenres();
  const parts = useParts();
  const prefectures = usePrefectures();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FieldValues>({
    defaultValues: defaultValues || {
      ambition: "",
      content: "",
      frequency: "",
      genres: [],
      maxAge: "",
      minAge: "",
      parts: [],
      places: [],
      sex: "",
      title: "",
    },
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formInner}>
        <div className={styles.fieldsWrapper}>
          <div>
            <label className={styles.label}>
              <span>
                タイトル<abbr className={styles.required}>*</abbr>
              </span>
              <Input {...register("title")} />
            </label>
            {errors.title ? (
              <p className={styles.errorMessage}>{errors.title.message}</p>
            ) : null}
          </div>
          <div>
            <label className={styles.label}>
              <span>
                募集内容<abbr className={styles.required}>*</abbr>
              </span>
              <div className={styles.contentTextareaWrapper}>
                <Textarea {...register("content")} />
              </div>
            </label>
            {errors.content ? (
              <p className={styles.errorMessage}>{errors.content.message}</p>
            ) : null}
          </div>
        </div>
        <HorizontalRule />
        <div className={styles.fieldsWrapper}>
          <div>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                募集パート<abbr className={styles.required}>*</abbr>
                <span>（3つまで選択可能です）</span>
              </legend>
              <ul className={styles.list}>
                {parts.map((part) => (
                  <li key={part}>
                    <label className={styles.checkboxLabel}>
                      <input
                        {...register("parts")}
                        type="checkbox"
                        value={part}
                      />
                      <span>{part}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            {errors.parts ? (
              <p className={styles.errorMessage}>
                {(errors.parts as unknown as FieldError).message}
              </p>
            ) : null}
          </div>
          <div>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                ジャンル<abbr className={styles.required}>*</abbr>
                <span>（3つまで選択可能です）</span>
              </legend>
              <ul className={styles.list}>
                {genres.map((genre) => (
                  <li key={genre}>
                    <label className={styles.checkboxLabel}>
                      <input
                        {...register("genres")}
                        type="checkbox"
                        value={genre}
                      />
                      <span>{genre}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            {errors.genres ? (
              <p className={styles.errorMessage}>
                {(errors.genres as unknown as FieldError).message}
              </p>
            ) : null}
          </div>
          <div>
            <label className={styles.label}>
              <span>
                性別<abbr className={styles.required}>*</abbr>
              </span>
              <Select
                {...register("sex")}
                options={[
                  { label: "", value: "" },
                  { label: "男女問わない", value: "男女問わない" },
                  { label: "男性のみ", value: "男性のみ" },
                  { label: "女性のみ", value: "女性のみ" },
                ]}
              />
            </label>
            {errors.sex ? (
              <p className={styles.errorMessage}>{errors.sex.message}</p>
            ) : null}
          </div>
          <div>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                年齢<abbr className={styles.required}>*</abbr>
              </legend>
              <div className={styles.ageFieldsWrapper}>
                <span className={styles.ageFieldWrapper}>
                  <Select
                    {...register("minAge")}
                    options={[
                      { label: "", value: "" },
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
                <span>〜</span>
                <span className={styles.ageFieldWrapper}>
                  <Select
                    {...register("maxAge")}
                    options={[
                      { label: "", value: "" },
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
              </div>
            </fieldset>
            {errors.minAge || errors.maxAge ? (
              <div className={styles.errorMessage}>
                {errors.minAge ? <p>{errors.minAge.message}</p> : null}
                {errors.maxAge ? <p>{errors.maxAge.message}</p> : null}
              </div>
            ) : null}
          </div>
          <div>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                活動場所<abbr className={styles.required}>*</abbr>
                <span>（3箇所まで選択可能です）</span>
              </legend>
              <ul className={styles.list}>
                {prefectures.map((prefecture) => (
                  <li key={prefecture}>
                    <label className={styles.checkboxLabel}>
                      <input
                        {...register("places")}
                        type="checkbox"
                        value={prefecture}
                      />
                      <span>{prefecture}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            {errors.places ? (
              <p className={styles.errorMessage}>
                {(errors.places as unknown as FieldError).message}
              </p>
            ) : null}
          </div>
          <div>
            <label className={styles.label}>
              <span>
                活動頻度<abbr className={styles.required}>*</abbr>
              </span>
              <Input {...register("frequency")} />
            </label>
            {errors.frequency ? (
              <p className={styles.errorMessage}>{errors.frequency.message}</p>
            ) : null}
          </div>
          <div>
            <label className={styles.label}>
              <span>
                志向性<abbr className={styles.required}>*</abbr>
              </span>
              <Select
                {...register("ambition")}
                options={[
                  { label: "", value: "" },
                  { label: "アマチュア志向", value: "アマチュア志向" },
                  { label: "ややアマチュア志向", value: "ややアマチュア志向" },
                  { label: "ややプロ志向", value: "ややプロ志向" },
                  { label: "プロ志向", value: "プロ志向" },
                ]}
              />
            </label>
            {errors.ambition ? (
              <p className={styles.errorMessage}>{errors.ambition.message}</p>
            ) : null}
          </div>
        </div>
        <HorizontalRule />
        <div className={styles.buttonWrapper}>
          <Button type="submit">
            {articleId ? "記事を修正する" : "メンバーを募集する"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ArticleForm;
