import Heading2 from "components/atoms/Heading2";
import Article from "components/molecules/Article";
import useUser from "hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEventHandler, useCallback } from "react";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";
import styles from "./style.module.scss";

function AboutTop(): JSX.Element {
  const { uid } = useUser();
  const router = useRouter();
  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      e.preventDefault();

      if (!uid) {
        toast(
          <p>
            <Link href="/signin">
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
          </p>,
          { id: "_app" }
        );

        return;
      }

      router.push(`/${uid}/report`);
    },
    [router, uid]
  );
  const [_, copy] = useCopyToClipboard();
  const handleCopy = useCallback(async () => {
    await copy(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");

    toast.success("メールアドレスをコピーしました", { id: "_app" });
  }, [copy]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <Article
          heading={
            <div className={styles.heading2Wrapper}>
              <Heading2 text="サービス概要" />
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
              <Heading2 text="ご利用規約" />
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
              <li>記事を削除した場合、記事に紐づくメッセージも削除されます</li>
              <li>同時に募集可能な記事は 3 件までとなっております</li>
              <li>
                アカウント登録時にご入力いただいたユーザー情報は公開情報となります
              </li>
              <li>
                ご利用規約を守られない方や一般常識から著しく逸脱している行動や言動を行われた方につきましては、事前の連絡なくアカウントをブロックさせていただきます
              </li>
              <li>事前の連絡なくサービスを終了する可能性がございます</li>
            </ul>
          </div>
        </Article>
        <Article
          heading={
            <div className={styles.heading2Wrapper}>
              <Heading2 text="運営への連絡" />
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
              <Heading2 text="寄付" />
            </div>
          }
        >
          <div className={styles.inner2}>
            <p>
              りくばん！ではサービスの使いやすさを優先するため、広告の掲載を行っておりません。
              <br />
              そのため、サーバー代などの運営費用につきましては、すべて弊社で支払っております。
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
                <button className={styles.anchor} onClick={handleCopy}>
                  メールアドレスをコピーする
                </button>
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
