import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEventHandler, useCallback, useContext, useMemo } from "react";
import { CopyToClipboard, Props } from "react-copy-to-clipboard";
import { useSnackbar } from "react-simple-snackbar";
import styles from "./style.module.scss";
import Heading2 from "components/atoms/Heading2";
import Article from "components/molecules/Article";
import UserContext from "contexts/UserContext";

function AboutTop(): JSX.Element {
  const { user } = useContext(UserContext);
  const uid = useMemo(() => {
    if (!user) {
      return undefined;
    }

    const { uid } = user;

    return uid;
  }, [user]);
  const router = useRouter();
  const [openSnackbar] = useSnackbar();
  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      e.preventDefault();

      if (!uid) {
        openSnackbar(
          <p>
            <Link href="signin">
              <a
                style={{
                  color: "#8ab4f8",
                  margin: "0 4px",
                  textDecoration: "underline",
                }}
              >
                サインイン
              </a>
            </Link>
            すると連絡可能になります
          </p>
        );

        return;
      }

      router.push(`/${uid}/report`);
    },
    [openSnackbar, router, uid]
  );
  const handleCopy = useCallback<NonNullable<Props["onCopy"]>>(() => {
    openSnackbar("メールアドレスをコピーしました");
  }, [openSnackbar]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <Article
          heading={
            <div className={styles.heading2Wrapper}>
              <Heading2>サービス概要</Heading2>
            </div>
          }
        >
          <div className={styles.inner2}>
            <p>
              りくばん！はバンドメンバーを募集することができるサービスです。
            </p>
          </div>
        </Article>
        <Article
          heading={
            <div className={styles.heading2Wrapper}>
              <Heading2>ご利用規約</Heading2>
            </div>
          }
        >
          <div className={styles.inner2}>
            <ul className={styles.list}>
              <li>
                バンドメンバーの募集や応募を行いたい場合につきましては、
                <Link href="/signin">
                  <a className={styles.anchor}>サインイン</a>
                </Link>
                していただく必要があります
              </li>
              <li>ご利用は完全に無料となっております</li>
              <li>
                りくばん！を通して発生したトラブルにつきましては、一切の責任を負いません
              </li>
              <li>
                募集開始から 3
                ヶ月経過した記事、および記事に紐づくメッセージは自動的に削除されます
              </li>
              <li>同時に募集可能な記事は 3 件までとなっております</li>
              <li>
                アカウント登録時にご入力いただいたユーザー情報は公開情報となります、あらかじめご了承ください
              </li>
              <li>
                ご利用規約を守られない方や、一般常識から著しく逸脱している行動や言動を行われた方につきましては、事前のご連絡なくアカウントをブロックさせていただきます
              </li>
              <li>
                事前のご報告なくサービスを終了する可能性もございます、あらかじめご了承ください
              </li>
            </ul>
          </div>
        </Article>
        <Article
          heading={
            <div className={styles.heading2Wrapper}>
              <Heading2>運営への連絡</Heading2>
            </div>
          }
        >
          <div className={styles.inner2}>
            <p>
              運営へ連絡を行いたい場合につきましては、
              <Link href="#">
                <a className={styles.anchor} onClick={handleClick}>
                  こちら
                </a>
              </Link>
              よりご連絡ください。
              <br />
              ただし、以下の理由<strong>以外</strong>
              の内容をお送りいただいた場合につきましては、アカウントをブロックさせていただきます。
            </p>
            <ul className={styles.list}>
              <li>バグ・障害報告</li>
              <li>迷惑ユーザーのご連絡</li>
              <li>ポジティブな内容のみのご連絡</li>
            </ul>
            <p>
              返信につきましては基本的に行っておりません、あらかじめご了承ください。
              <br />
              また、基本的にりくばん！に対する機能のご要望は受け付けておりません。
              <br />
              機能の要望を行いたい場合につきましては、寄付の項目をお読みください。
            </p>
          </div>
        </Article>
        <Article
          heading={
            <div className={styles.heading2Wrapper}>
              <Heading2>寄付</Heading2>
            </div>
          }
        >
          <div className={styles.inner2}>
            <p>
              りくばん！ではサービスの使いやすさを優先するため、広告の掲載を行っておりません。
              <br />
              そのため、サーバー代などの運営費用につきましては、すべて自腹で支払っております。
              <br />
              もし、りくばん！を通してかけがえのないバンドメンバーに出会えた方がおられましたら、心ばかり寄付していただけますと幸いです。
            </p>
            <ul className={styles.list}>
              <li>
                <a
                  className={styles.anchor}
                  href="https://amzn.to/3gBATS0"
                  rel="noreferrer"
                  target="_blank"
                >
                  Amazon ギフト券
                </a>
                （
                <CopyToClipboard
                  onCopy={handleCopy}
                  text={process.env.NEXT_PUBLIC_ADMIN_EMAIL || ""}
                >
                  <button className={styles.anchor}>
                    メールアドレスをコピーする
                  </button>
                </CopyToClipboard>
                ）
              </li>
              <li>
                <a
                  className={styles.anchor}
                  href="https://www.amazon.jp/hz/wishlist/ls/1HX7FE05W1CZE?ref_=wl_share"
                  rel="noreferrer"
                  target="_blank"
                >
                  Amazon ほしい物リスト
                </a>
              </li>
            </ul>
            <p>
              りくばん！に対するご要望がございましたら、寄付の際に合わせてご連絡いただけますと幸いです。
              <br />
              ただし、すべてのご要望にお答えすることはできませんので、あらかじめご了承ください。
              <br />
              また、寄付していただいた方につきましては、感謝の意を込めて以下にお名前を掲載させていただきます。
              <br />
              （掲載をご希望されない場合につきましては、その旨をご連絡いただけますと幸いです）
            </p>
          </div>
        </Article>
      </div>
    </div>
  );
}

export default AboutTop;
