import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DocsData, DocsDataTree } from '../../lib/get-docs-data';
import styles from './DocTree.module.scss';

export default function DocTree({ allDocsData }: { allDocsData: DocsDataTree[] }): JSX.Element {
  return (
    <div className={styles.root}>
      <h3><b><u>Docs</u></b></h3>
      <ul>
        {allDocsData.map(node => makeTree(node))}
      </ul>
    </div>
  );
}

function makeTree(treeNode: DocsDataTree): JSX.Element {
  let hasChildren = treeNode.children && treeNode.children.length > 0;
  let children = hasChildren ? <ul>{treeNode.children.map(child => makeTree(child))}</ul> : <></>;
  return (
    <li className={hasChildren ? styles.hasChildren : null}>
      {makeEntry(treeNode?.item)}
      {children}
    </li>
  )
}

function makeEntry(data: DocsData): JSX.Element {
  // console.log(data);
  if (!data) { return <></>; }
  const path = '/' + data.route.join('/');
  return (
    <a href={path}><span>{data.title}</span></a>
  )
}
