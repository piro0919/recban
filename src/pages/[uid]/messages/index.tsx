import Layout from "components/templates/Layout";
import MessagesTop, {
  MessagesTopProps,
} from "components/templates/MessagesTop";
import Seo from "components/templates/Seo";
import getClient from "libs/getClient";
import getFirestore from "libs/getFirestore";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";

export type MessagesProps = Pick<
  MessagesTopProps,
  "applicantMessages" | "defaultIndex" | "recruiterMessages" | "uid"
>;

function Messages({
  applicantMessages,
  defaultIndex,
  recruiterMessages,
  uid,
}: MessagesProps): JSX.Element {
  return (
    <>
      <Seo noindex={true} title="メッセージ一覧" />
      <MessagesTop
        applicantMessages={applicantMessages}
        defaultIndex={defaultIndex}
        recruiterMessages={recruiterMessages}
        uid={uid}
      />
    </>
  );
}

Messages.getLayout = function getLayout(page: ReactElement): JSX.Element {
  return <Layout>{page}</Layout>;
};

type ParsedUrlQuery = {
  uid: string;
};

export const getServerSideProps: GetServerSideProps<
  MessagesProps,
  ParsedUrlQuery
> = async ({ params, query: { article } }) => {
  const client = getClient();

  if (
    !params ||
    (article !== "applicant" && article !== "recruiter") ||
    !client
  ) {
    return signout;
  }

  const { uid } = params;
  const db = getFirestore();
  const collectionRef = db.collection("users");
  const [{ applicantMessages }, { recruiterMessages }] = await Promise.all([
    // 応募中の記事一覧の取得 start
    client
      .getEntries<Contentful.IMessagesFields>({
        content_type: "messages" as Contentful.CONTENT_TYPE,
        "fields.applicantUid": uid,
      })
      .then(async ({ items }) => ({
        applicantMessages: await Promise.all(
          items
            .filter(({ fields: { messages } }) => messages)
            .map(
              async ({
                fields: { articleId, messages, unreadUser },
                sys: { id },
              }) => {
                const [date, user, ...contents] =
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  messages![messages!.length - 1].split(",");

                let name = "";

                if (user === "applicant") {
                  name = "あなた";
                } else {
                  const {
                    fields: { uid },
                  } = await client.getEntry<Contentful.IArticlesFields>(
                    articleId
                  );
                  const docRef = collectionRef.doc(uid);
                  const snapshot = await docRef.get();

                  if (snapshot.exists) {
                    const { name: applicantName } =
                      snapshot.data() as Firestore.User;

                    name = applicantName;
                  }
                }

                return {
                  date,
                  id,
                  name,
                  content: contents.join(","),
                  isNew: unreadUser === "applicant",
                };
              }
            )
        ),
      })),
    // 応募中の記事一覧の取得 end
    // 募集中の記事一覧の取得 start
    client
      .getEntries<Contentful.IArticlesFields>({
        content_type: "articles" as Contentful.CONTENT_TYPE,
        "fields.uid": uid,
        limit: 3,
      })
      .then(async ({ items }) => ({
        recruiterMessages: (
          await Promise.all(
            items.map(({ sys: { id: articleId } }) =>
              client
                .getEntries<Contentful.IMessagesFields>({
                  content_type: "messages" as Contentful.CONTENT_TYPE,
                  "fields.articleId": articleId,
                })
                .then(
                  async ({ items }) =>
                    await Promise.all(
                      items
                        .filter(({ fields: { messages } }) => messages)
                        .map(
                          async ({
                            fields: { applicantUid, messages, unreadUser },
                            sys: { id },
                          }) => {
                            const [date, user, ...contents] =
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              messages![messages!.length - 1].split(",");

                            let name = "";

                            if (user === "recruiter") {
                              name = "あなた";
                            } else {
                              const docRef = collectionRef.doc(applicantUid);
                              const snapshot = await docRef.get();

                              if (snapshot.exists) {
                                const { name: applicantName } =
                                  snapshot.data() as Firestore.User;

                                name = applicantName;
                              }
                            }

                            return {
                              date,
                              id,
                              name,
                              content: contents.join(","),
                              isNew: unreadUser === "recruiter",
                            };
                          }
                        )
                    )
                )
            )
          )
        ).flat(),
      })),
    // 募集中の記事一覧の取得 end
  ]);

  return {
    props: {
      // 応募中の記事一覧
      applicantMessages,
      // 募集中の記事一覧
      recruiterMessages,
      uid,
      defaultIndex: article === "applicant" ? 0 : 1,
    },
  };
};

export default Messages;
