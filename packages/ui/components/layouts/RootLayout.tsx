import { ReactNode } from "react";
import NavSide from "../nav/NavSide";
import NavTop from "../nav/NavTop";
import styles from "./RootLayout.module.scss";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
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
          </div>
          <div className={styles.right}>{children}</div>
        </div>
      </div>
    </div>
  );
}
