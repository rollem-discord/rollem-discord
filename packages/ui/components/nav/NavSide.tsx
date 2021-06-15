import {
  Drawer,
  Hidden,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
} from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import LockIcon from "@material-ui/icons/Lock";
import { createStyles, makeStyles } from "@material-ui/styles";
import { SidePanelContext } from "@rollem/ui/lib/contexts/sidepanel-context";

const drawerWidth = '240px';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    homeWrapper: {
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.text.primary,
    },
    iconImage: {
      maxHeight: "64px",
      marginRight: ".5em",
    },
    textImage: {
      maxHeight: "1.5em",
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
      minWidth: drawerWidth,
      paddingRight: theme.spacing(1),
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
    <nav className={classes.drawer}>
      <SidePanelContext.Consumer>
        {({ mobileDrawerOpen, toggleDrawer }) => (
          <>
            <Hidden smDown implementation="css">
              <Drawer anchor="left" variant="permanent" open>
                <div className={classes.list}>
                  <SideNavContent></SideNavContent>
                </div>
              </Drawer>
            </Hidden>

            <Hidden mdUp implementation="css">
              <Drawer
                anchor="left"
                open={mobileDrawerOpen}
                onClose={toggleDrawer(false)}
              >
                <div
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                  className={classes.list}
                >
                  <SideNavContent></SideNavContent>
                </div>
              </Drawer>
            </Hidden>
          </>
        )}
      </SidePanelContext.Consumer>
    </nav>
  );
}

function SideNavContent() {
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
        <ListItem button component="a" href={`/docs`}>
          <ListItemIcon>
            <DescriptionIcon></DescriptionIcon>
          </ListItemIcon>
          <ListItemText>Docs</ListItemText>
        </ListItem>
        <ListItem button component="a" href={`/invite`}>
          <ListItemIcon>
            <img
              className={classes.textImage}
              src="/images/rollem-transparent.png"
            />
          </ListItemIcon>
          <ListItemText>Invite</ListItemText>
        </ListItem>
        <ListItem button component="a" href={`/privacy-policy`}>
          <ListItemIcon>
            <LockIcon></LockIcon>
          </ListItemIcon>
          <ListItemText>Privacy Policy</ListItemText>
        </ListItem>
      </List>
    </>
  );
}