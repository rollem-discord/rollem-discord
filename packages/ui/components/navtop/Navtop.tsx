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
          marginRight: theme.spacing(2),
        },
        "&:not(:first-child)": {
          marginLeft: theme.spacing(2),
        },
      },
    },
    spacer: {
      flexGrow: 1,
    },
  }),
);

export default function NavTop() {
  const classes = useStyles();
  const { data, error } = useSWR<RollemSessionData>(API_URL, fetcher);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6">
            <Link href={'/'}>
              <a className={classes.homeWrapper}>
                <img className={classes.iconImage} src="/images/rollem-transparent.png"></img>
                Rollem Rocks
              </a>
            </Link>
          </Typography>
          <ActiveLink href={`/docs`} activeClassName={classes.activeLink} className={classes.link}><a>Docs</a></ActiveLink>
          <Link href={`/invite`}><a className={classes.link}>Invite</a></Link>
          <Link href={`/docs/rollem-next`}><a className={classes.link}>vNext</a></Link>
          <div className={classes.spacer}></div>
          <DiscordProfile></DiscordProfile>
        </Toolbar>
      </AppBar>
    </div>
  );
}