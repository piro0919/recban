import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/atoms/Button";
import HorizontalRule from "components/atoms/HorizontalRule";
import Input from "components/atoms/Input";
import MultiselectReactDropdown from "components/atoms/MultiselectReactDropdown";
import Select from "components/atoms/Select";
import Textarea from "components/atoms/Textarea";
import useGenres from "hooks/useGenres";
import useParts from "hooks/useParts";
import usePrefectures from "hooks/usePrefectures";
import { useMemo } from "react";
import {
  Controller,
  FieldError,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import styles from "./style.module.scss";

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
    .max(3, "ジャンルは 3 つ以内で選択してください")
    .min(1, "ジャンルを 1 つ以上選択してください"),
  maxAge: yup
    .number()
    .typeError("最大年齢を選択してください")
    .when("minAge", (minAge: number, schema) => {
      console.log(typeof minAge);

      return isNaN(minAge)
        ? schema
        : schema.min(minAge, "最大年齢は最小年齢以上を選択してください");
    }),
  minAge: yup.number().typeError("最小年齢を選択してください"),
  parts: yup
    .array()
    .max(3, "募集パートは 3 つ以内で選択してください")
    .min(1, "募集パートを 1 つ以上選択してください"),
  places: yup
    .array()
    .max(3, "活動場所は 3 つ以内で選択してください")
    .min(1, "活動場所を 1 つ以上選択してください"),
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
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
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
  const prefecturesOptions = useMemo(
    () =>
      prefectures.flatMap(({ prefectures, region }) =>
        prefectures.map((prefecture) => ({
          prefecture,
          region,
        }))
      ),
    [prefectures]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.formInner}>
        <div className={styles.fieldsWrapper}>
          <div>
            <label className={`${styles.label} ${styles.inputLabel}`}>
              <span>
                タイトル<abbr className={styles.required}>*</abbr>
              </span>
              <Input
                {...register("title")}
                placeholder="タイトルを入力してください"
              />
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
                <Textarea
                  {...register("content")}
                  placeholder="募集内容を入力してください"
                  style={{
                    minHeight: "inherit",
                    resize: "vertical",
                  }}
                />
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
                <span>（ 3 つまで選択可能です）</span>
              </legend>
              <Controller
                control={control}
                name="parts"
                render={({ field: { name, ref, value } }): JSX.Element => (
                  <MultiselectReactDropdown
                    isObject={false}
                    onRemove={(selected): void => {
                      setValue(name, selected);
                    }}
                    onSelect={(selected): void => {
                      setValue(name, selected);
                    }}
                    options={parts}
                    placeholder="募集パートを選択または入力してください"
                    ref={ref}
                    selectedValues={value}
                    selectionLimit={3}
                  />
                )}
              />
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
                <span>（ 3 つまで選択可能です）</span>
              </legend>
              <Controller
                control={control}
                name="genres"
                render={({ field: { name, ref, value } }): JSX.Element => (
                  <MultiselectReactDropdown
                    isObject={false}
                    onRemove={(selected): void => {
                      setValue(name, selected);
                    }}
                    onSelect={(selected): void => {
                      setValue(name, selected);
                    }}
                    options={genres}
                    placeholder="ジャンルを選択または入力してください"
                    ref={ref}
                    selectedValues={value}
                    selectionLimit={3}
                  />
                )}
              />
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
              <Controller
                control={control}
                name="sex"
                render={({ field: { name, ref, value } }): JSX.Element => (
                  <Select
                    onChange={({ value }): void => {
                      setValue(name, value);
                    }}
                    options={["", "男女問わない", "男性のみ", "女性のみ"]}
                    placeholder="性別を選択してください"
                    ref={ref}
                    value={value}
                  />
                )}
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
                  <Controller
                    control={control}
                    name="minAge"
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
                <span>〜</span>
                <span className={styles.ageFieldWrapper}>
                  <Controller
                    control={control}
                    name="maxAge"
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
                <span>（ 3 箇所まで選択可能です）</span>
              </legend>
              <Controller
                control={control}
                name="places"
                render={({ field: { name, ref, value } }): JSX.Element => (
                  <MultiselectReactDropdown
                    displayValue="prefecture"
                    groupBy="region"
                    onRemove={(selected): void => {
                      setValue(
                        name,
                        selected.map(
                          ({
                            prefecture,
                          }: {
                            prefecture: string;
                            region: string;
                          }) => prefecture
                        )
                      );
                    }}
                    onSelect={(selected): void => {
                      setValue(
                        name,
                        selected.map(
                          ({
                            prefecture,
                          }: {
                            prefecture: string;
                            region: string;
                          }) => prefecture
                        )
                      );
                    }}
                    options={prefecturesOptions}
                    placeholder="活動場所を選択または入力してください"
                    ref={ref}
                    selectedValues={value.map((place) =>
                      prefecturesOptions.find(
                        ({ prefecture }) => place === prefecture
                      )
                    )}
                    selectionLimit={3}
                  />
                )}
              />
            </fieldset>
            {errors.places ? (
              <p className={styles.errorMessage}>
                {(errors.places as unknown as FieldError).message}
              </p>
            ) : null}
          </div>
          <div>
            <label className={`${styles.label} ${styles.inputLabel}`}>
              <span>
                活動頻度<abbr className={styles.required}>*</abbr>
              </span>
              <Input
                {...register("frequency")}
                placeholder="活動頻度を入力してください"
              />
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
              <Controller
                control={control}
                name="ambition"
                render={({ field: { name, ref, value } }): JSX.Element => (
                  <Select
                    isDisplayAbove={true}
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
                    placeholder="志向性を選択してください"
                    ref={ref}
                    value={value}
                  />
                )}
              />
            </label>
            {errors.ambition ? (
              <p className={styles.errorMessage}>{errors.ambition.message}</p>
            ) : null}
          </div>
        </div>
        <HorizontalRule />
        <div className={styles.buttonWrapper}>
          <Button disabled={isSubmitting} type="submit">
            {articleId ? "記事を修正する" : "メンバーを募集する"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ArticleForm;
