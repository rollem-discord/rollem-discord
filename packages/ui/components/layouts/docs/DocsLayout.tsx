import { DocsDataTree } from "../../../lib/markdown/docs/get-docs-data";
import DocTree from "./DocTree";
import NavTop from "../../navtop/NavTop";
import styles from "./DocsLayout.module.scss";
import NavSide from "../../navtop/NavSide";

export default function DocsLayout({
  children,
  allDocsData,
}: {
  children: unknown;
  allDocsData: DocsDataTree[];
}) {
  return (
    <div className={styles.trueRoot}>
      <NavSide></NavSide>
      <div className={styles.root}>
        <div className={styles.top}>
          <NavTop></NavTop>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
          <DocTree allDocsData={allDocsData}></DocTree>
          </div>
          <div className={styles.right}>{children}</div>
        </div>
      </div>
    </div>
  );
}
