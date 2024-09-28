import { Button, Collapse, Drawer, Hidden, IconButton, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { SidePanelContext } from '@rollem/ui/lib/contexts/sidepanel-context';
import { useState } from 'react';
import { DocsData, DocsDataTree } from '../../../lib/markdown/docs/get-docs-data';
import styles from './DocTree.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minHeight: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    listHeader: {
      borderBottom: '1px solid',
      borderColor: theme.palette.divider,
    }
  }),
);

export default function DocTree({ allDocsData }: { allDocsData: DocsDataTree[] }): JSX.Element {
  const classes = useStyles();

  return (<>
    <Hidden mdDown>
      <DocTreeListRoot allDocsData={allDocsData}></DocTreeListRoot>
    </Hidden>
    <Hidden mdUp>
      <SidePanelContext.Consumer>
        {({ docsDrawerOpen, toggleDocsDrawer }) => (
          <Drawer anchor="left" open={docsDrawerOpen} onClose={toggleDocsDrawer(false)}>
            <DocTreeListRoot allDocsData={allDocsData}></DocTreeListRoot>
          </Drawer>
        )}
      </SidePanelContext.Consumer>
    </Hidden>
  </>);
}

function DocTreeListRoot({ allDocsData }: { allDocsData: DocsDataTree[]}): JSX.Element {
  const classes = useStyles();

  return (
    <section className={styles.root}>
      <List
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Typography variant="h5" align="center" className={classes.listHeader}>
              Docs
            </Typography>
          </ListSubheader>
        }
        className={classes.root}
        dense
      >
        {allDocsData.filter(child => !child.item.hide_in_sidebar).map((node) => makeTree(node))}
      </List>
    </section>
  );
}

function makeTree(treeNode: DocsDataTree, nested: boolean = false): JSX.Element {
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const children = treeNode.children?.filter(child => !child.item.hide_in_sidebar);
  const hasChildren = children && children.length > 0;
  
  let childElements = <></>;
  let openToggle = <></>;
  let handleClick = (event: React.MouseEvent) => { };
  if (hasChildren) {
    childElements = (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding dense>
          {children.map(child => makeTree(child, true))}
        </List>
      </Collapse>
    );
    
    handleClick = (event: React.MouseEvent) => {
      event.nativeEvent.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
      setOpen(!open);
    };

    openToggle = (
      <IconButton size="small" onClick={handleClick}>
        {open ? <ExpandLess/> : <ExpandMore />}
      </IconButton>
    );
  }

  const path = '/docs/' + treeNode.item.route.join('/');
  return (
    <>
      <ListItem button component="a" href={path} className={nested ? classes.nested : null}>
        <ListItemText primary={treeNode.item.title} />
        {openToggle}
      </ListItem>
      {childElements}
    </>
  );
}

function makeEntry(data: DocsData): JSX.Element {
  // console.log(data);
  if (!data) { return <></>; }
  const path = '/docs/' + data.route.join('/');
  return (
    <a href={path}><span>{data.title}</span></a>
  )
}
