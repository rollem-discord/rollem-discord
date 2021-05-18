import { Button, Collapse, IconButton, List, ListItem, ListItemText, ListSubheader, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
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
        {allDocsData.map((node) => makeTree(node))}
      </List>
    </section>
  );
}

function makeTree(treeNode: DocsDataTree, nested: boolean = false): JSX.Element {
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  let hasChildren = treeNode.children && treeNode.children.length > 0;
  
  let children = <></>;
  let openToggle = <></>;
  let handleClick = (event: React.MouseEvent) => { };
  if (hasChildren) {
    children = (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding dense>
          {treeNode.children.map(child => makeTree(child, true))}
        </List>
      </Collapse>
    );
    
    handleClick = (event: React.MouseEvent) => {
      setOpen(!open);
      event.stopPropagation();
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
      {children}
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
