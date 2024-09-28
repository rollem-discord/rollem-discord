import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { RollemSessionData } from '@rollem/ui/lib/withSession';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { DiscordProfile } from './DiscordProfile';
import { Hidden, Tooltip } from '@mui/material';
import { SidePanelContext } from '@rollem/ui/lib/contexts/sidepanel-context';

const API_URL = '/api/auth/discord/getData';

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

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
      minWidth: '250px',
    },
    panel: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  }),
);

export default function NavTop() {
  const classes = useStyles();
  const { data, error } = useSWR<RollemSessionData>(API_URL, fetcher);

  return (
    (<SidePanelContext.Consumer>
      {({ toggleDrawer }) => (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar className={classes.toolbar}>
              <Hidden mdUp implementation="css">
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  onClick={toggleDrawer(true)}
                  color="inherit"
                  aria-label="menu"
                  size="large">
                  <MenuIcon />
                </IconButton>
              </Hidden>
              <Tooltip title="Rollem Rocks">
                <Typography variant="h6">
                  <Link href={"/"} className={classes.homeWrapper}>

                    <img
                      className={classes.iconImage}
                      src="/images/rollem-transparent.png"
                    ></img>

                  </Link>
                </Typography>
              </Tooltip>
              <div className={classes.spacer}></div>
              <DiscordProfile></DiscordProfile>
            </Toolbar>
          </AppBar>
        </div>
      )}
    </SidePanelContext.Consumer>)
  );
}