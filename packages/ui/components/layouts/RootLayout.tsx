import { RollemSessionData } from "@rollem/ui/lib/withSession";
import { DocsDataTree } from "../../lib/get-docs-data";
import DocTree from "../navside/DocTree";
import NavTop from "../navtop/Navtop";
import styles from "./RootLayout.module.scss";

export default function RootLayout({
  children,
  allDocsData,
}: {
  children: unknown;
  allDocsData: DocsDataTree[];
}) {
  return (
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
  );
}
