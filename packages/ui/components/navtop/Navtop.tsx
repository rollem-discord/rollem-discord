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

const API_URL = '/api/auth/discord/getData';

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    activeLink: {
      borderBottom: "2px solid white",
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
            Rollem Rocks
          </Typography>
          <ActiveLink href={`/docs`} activeClassName={classes.activeLink}><a>Docs</a></ActiveLink>
          <span className={classes.spacer}></span>
          <span>
            <img src={"https://cdn.discordapp.com/avatars/" + data?.discord?.user?.id + "/" + data?.discord?.user?.avatar + ".png"}></img>
            <span>{data?.discord?.user?.username}</span>
            <span>#{data?.discord?.user?.discriminator}</span>
          </span>
          <Button href="https://discord.com/oauth2/authorize?client_id=240732567744151553&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds" color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}