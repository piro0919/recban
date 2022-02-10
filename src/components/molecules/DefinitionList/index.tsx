import { Fragment, ReactNode, useMemo } from "react";
import styles from "./style.module.scss";

type Definition = {
  description: ReactNode;
  term: string;
};

export type DefinitionListProps = {
  definitions: Definition[];
};

function DefinitionList({ definitions }: DefinitionListProps): JSX.Element {
  const items = useMemo(
    () =>
      definitions.map(({ description, term }) => (
        <Fragment key={term}>
          <dt className={styles.term}>{term}</dt>
          <dd>{description}</dd>
        </Fragment>
      )),
    [definitions]
  );

  return <dl className={styles.list}>{items}</dl>;
}

export default DefinitionList;
