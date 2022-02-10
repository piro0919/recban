import { CSSProperties, ReactNode } from "react";
import styles from "./style.module.scss";

export type ArticleProps = {
  children: ReactNode;
  heading: ReactNode;
  style?: CSSProperties;
};

function Article({ children, heading, style }: ArticleProps): JSX.Element {
  return (
    <article className={styles.article} style={style}>
      {heading}
      {children}
    </article>
  );
}

export default Article;
