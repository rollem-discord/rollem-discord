import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ActiveLink from '../ActiveLink';
import Link from 'next/link';
import classes from './Navtop.module.scss';
import { RollemSessionData } from '@rollem/ui/lib/withSession';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { DiscordProfile } from './DiscordProfile';
import { useState } from 'react';
import { Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import NavSide from './NavSide';

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
      marginRight: theme.spacing(2),
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
  const [state, setState] = useState({ drawerOpen: false, });

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, drawerOpen: open });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={toggleDrawer(true)}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Tooltip title="Rollem Rocks">
            <Typography variant="h6">
              <Link href={"/"}>
                <a className={classes.homeWrapper}>
                  <img
                    className={classes.iconImage}
                    src="/images/rollem-transparent.png"
                  ></img>
                </a>
              </Link>
            </Typography>
          </Tooltip>
          <div className={classes.spacer}></div>
          <DiscordProfile></DiscordProfile>
        </Toolbar>
      </AppBar>

      <Hidden xsDown implementation="css">

        <Drawer
          anchor="left"
          variant="permanent"
          open={state.drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <div
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            className={classes.list}
          >
            <NavSide></NavSide>
          </div>
        </Drawer>
      </Hidden>
    </div>
  );
}