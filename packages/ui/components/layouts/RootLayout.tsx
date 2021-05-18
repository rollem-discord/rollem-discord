import { RollemSessionData } from "@rollem/ui/lib/withSession";
import { DocsDataTree } from "../../lib/markdown/docs/get-docs-data";
import DocTree from "./docs/DocTree";
import NavTop from "../navtop/NavTop";
import styles from "./RootLayout.module.scss";

export default function RootLayout({
  children,
}: {
  children: unknown;
}) {
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <NavTop></NavTop>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          
        </div>
        <div className={styles.right}>{children}</div>
      </div>
    </div>
  );
}
