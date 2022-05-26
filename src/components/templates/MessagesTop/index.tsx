import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { Tab, Tabs, TabList, TabPanel, TabsProps } from "react-tabs";
import styles from "./style.module.scss";

type Message = {
  content: string;
  date: string;
  id: string;
  isNew: boolean;
  name: string;
};

export type MessagesTopProps = Pick<TabsProps, "defaultIndex"> & {
  applicantMessages: Message[];
  recruiterMessages: Message[];
  uid: string;
};

function MessagesTop({
  applicantMessages,
  defaultIndex,
  recruiterMessages,
  uid,
}: MessagesTopProps): JSX.Element {
  const applicantMessageItems = useMemo(
    () =>
      applicantMessages.map(({ content, date, id, isNew, name }) => (
        <li className={styles.item} key={id}>
          <Link href={`/${uid}/messages/${id}`}>
            <a className={`${styles.anchor} ${isNew ? styles.new : ""}`}>
              <div className={styles.name}>
                {name === "あなた" ? name : `${name} さん`}
              </div>
              <div className={styles.content}>{content}</div>
              <div className={styles.date}>
                {dayjs(date).format("YYYY.MM.DD HH:mm")}
              </div>
            </a>
          </Link>
        </li>
      )),
    [applicantMessages, uid]
  );
  const recruiterMessageItems = useMemo(
    () =>
      recruiterMessages.map(({ content, date, id, isNew, name }) => (
        <li className={styles.item} key={id}>
          <Link href={`/${uid}/messages/${id}`}>
            <a className={`${styles.anchor} ${isNew ? styles.new : ""}`}>
              <div className={styles.name}>
                {name === "あなた" ? name : `${name} さん`}
              </div>
              <div className={styles.content}>{content}</div>
              <div className={styles.date}>
                {dayjs(date).format("YYYY.MM.DD HH:mm")}
              </div>
            </a>
          </Link>
        </li>
      )),
    [recruiterMessages, uid]
  );
  const router = useRouter();
  const handleSelect = useCallback<NonNullable<TabsProps["onSelect"]>>(
    (index) => {
      router.replace(
        `/${uid}/messages?article=${index === 0 ? "applicant" : "recruiter"}`,
        undefined,
        { shallow: true }
      );
    },
    [router, uid]
  );

  return (
    <Tabs defaultIndex={defaultIndex} onSelect={handleSelect}>
      <TabList className={styles.tabList}>
        <Tab className={styles.tab} selectedClassName={styles.selected}>
          応募中の記事
        </Tab>
        <Tab className={styles.tab} selectedClassName={styles.selected}>
          募集中の記事
        </Tab>
      </TabList>
      <TabPanel>
        <ul>{applicantMessageItems}</ul>
      </TabPanel>
      <TabPanel>
        <ul>{recruiterMessageItems}</ul>
      </TabPanel>
    </Tabs>
  );
}

export default MessagesTop;
