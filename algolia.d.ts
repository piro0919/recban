declare namespace Algolia {
  type MessageType = {
    content: string;
    date: string;
    // applicant: 応募者
    // recruiter: 募集者
    user: "applicant" | "recruiter";
  };

  type Message = {
    // 応募者のユーザーID
    applicantUserId: string;
    articleId: string;
    messages: MessageType[];
  };
}
