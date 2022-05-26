import dynamic from "next/dynamic";

const PWAPrompt = dynamic<ReactIosPwaPrompt.PWAPromptProps>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  () => import("react-ios-pwa-prompt"),
  {
    ssr: false,
  }
);

function IosPwaPrompt(): JSX.Element {
  return (
    <PWAPrompt
      copyAddHomeButtonLabel="2) 「ホーム画面に追加」をタップします。"
      copyBody="このウェブサイトにはアプリ機能があります。ホーム画面に追加してフルスクリーンおよびオフラインで使用できます。"
      copyClosePrompt="キャンセル"
      copyShareButtonLabel="1) （四角から矢印が飛び出したマーク）をタップします。"
      copyTitle="ホーム画面に追加"
      // debug={process.env.NODE_ENV === "development"}
    />
  );
}

export default IosPwaPrompt;
