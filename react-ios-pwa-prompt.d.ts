declare namespace ReactIosPwaPrompt {
  type PWAPromptProps = Partial<{
    copyAddHomeButtonLabel: string;
    copyBody: string;
    copyClosePrompt: string;
    copyShareButtonLabel: string;
    copyTitle: string;
    debug: boolean;
    delay: number;
    permanentlyHideOnDismiss: boolean;
    promptOnVisit: number;
    timesToShow: number;
  }>;
}
