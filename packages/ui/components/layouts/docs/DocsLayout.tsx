import { DocsDataTree } from "../../../lib/markdown/docs/get-docs-data";
import DocTree from "./DocTree";
import NavTop from "../../nav/NavTop";
import styles from "./DocsLayout.module.scss";
import NavSide from "../../nav/NavSide";
import { SidePanelContext } from "@rollem/ui/lib/contexts/sidepanel-context";
import { Button, Container, Hidden } from "@mui/material";

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
          <div className={styles.right}>
            <Hidden mdUp>
              <SidePanelContext.Consumer>
                {({ toggleDocsDrawer }) => (
                  <Container maxWidth="xs">
                    <Button className={styles.wideButton} onClick={toggleDocsDrawer(true)}>Show Docs Menu</Button>
                  </Container>
                )}
              </SidePanelContext.Consumer>
            </Hidden>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
