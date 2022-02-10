import { AxiosResponse } from "axios";
import { ReactElement, useCallback } from "react";
import { useSnackbar } from "react-simple-snackbar";
import Layout from "components/templates/Layout";
import MyEmailNew, { MyEmailNewProps } from "components/templates/MyEmailNew";
import Seo from "components/templates/Seo";
import axiosInstance from "libs/axiosInstance";
import { PostReportData, PostReportBody } from "pages/api/report";

export type ReportProps = {
  userId: string;
};

function Report({ userId }: ReportProps): JSX.Element {
  const [openSnackbar] = useSnackbar();
  const handleSubmit = useCallback<MyEmailNewProps["onSubmit"]>(
    async ({ subject, text }) => {
      await axiosInstance.post<
        PostReportData,
        AxiosResponse<PostReportData>,
        PostReportBody
      >("/api/report", {
        text,
        userId,
        subject: `（${name}）${subject}`,
      });

      openSnackbar("メールを送信しました！");
    },
    [openSnackbar, userId]
  );

  return (
    <>
      <Seo noindex={true} title="運営へ連絡" />
      <MyEmailNew collocutorName="運営に連絡する" onSubmit={handleSubmit} />
    </>
  );
}

Report.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

export default Report;
