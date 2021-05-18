import {
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
} from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import { createStyles, makeStyles } from "@material-ui/styles";
import styles from '@rollem/ui/styles/standard.module.scss';
import ActiveLink from "../ActiveLink";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    homeWrapper: {
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "center",
      justifyContent: "center",
    },
    iconImage: {
      maxHeight: "64px",
      marginRight: ".5em",
    },
    profileImage: {
      maxHeight: "48px",
      marginRight: ".25em",
    },
    root: {
      flexGrow: 1,
    },
    activeLink: {
      borderBottom: "2px solid white",
    },
    link: {
      height: "64px",
      display: "flex",
      flexFlow: "row nowrap",
      padding: "16px",
      alignItems: "center",
    },
    toolbar: {
      "& > *": {
        "&:not(:last-child)": {
          marginRight: theme.spacing(1),
        },
        "&:not(:first-child)": {
          marginLeft: theme.spacing(1),
        },
      },
    },
    spacer: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: 0,
    },
    list: {
      minWidth: "250px",
      marginRight: theme.spacing(2),
    },
    panel: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  })
);

export default function NavSide() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6">
        <Link href={"/"}>
          <a className={classes.homeWrapper}>
            <img
              className={classes.iconImage}
              src="/images/rollem-transparent.png"
            ></img>
            Rollem&nbsp;Rocks
          </a>
        </Link>
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <DescriptionIcon></DescriptionIcon>
          </ListItemIcon>
          <ListItemText>
            <ActiveLink
              href={`/docs`}
              activeClassName={classes.activeLink}
              className={classes.link}
            >
              <a>Docs</a>
            </ActiveLink>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <img
              className={styles.textImage}
              src="/images/rollem-transparent.png"
            />
          </ListItemIcon>
          <ListItemText>
            <Link href={`/invite`}>
              <a className={classes.link}>Invite</a>
            </Link>
          </ListItemText>
        </ListItem>
      </List>
    </>
  );
}
