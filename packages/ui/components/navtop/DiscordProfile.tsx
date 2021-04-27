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
import { Avatar } from '@material-ui/core';

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
    profileImage: {
      maxHeight: "48px",
      marginRight: ".25em",
    },
    discrimator: {
      opacity: ".5",
    },
    link: {
      height: "64px",
      display: "flex",
      flexFlow: "row nowrap",
      padding: "16px",
      alignItems: "center",
    },
    activeLink: {
      backgroundColor: "rgba(0,0,0,.2)",
    },
  }),
);

export function DiscordProfile() {
  const classes = useStyles();
  const { data, error } = useSWR<RollemSessionData>(API_URL, fetcher);

  if (data?.discord?.user) {
    const avatar = data?.discord?.user?.avatar;
    const userId = data?.discord?.user?.id;
    const username = data?.discord?.user?.username;
    const discriminator = data?.discord?.user?.discriminator;

    const logoutUrl = "/account/logout";

    return (
      <>
        <ActiveLink href={`/account`} className={classes.link} activeClassName={classes.activeLink}>
          <a>
            <span className={classes.homeWrapper}>
              <Avatar
                src={`https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`}
                className={classes.profileImage}
              ></Avatar>
              <span>{username}</span>
              <span className={classes.discrimator}>#{discriminator}</span>
            </span>
          </a>
        </ActiveLink>
        <Link href={logoutUrl}>
          <a className={classes.link}>Logout</a>
        </Link>
      </>
    );
  }
  

  const loginUrl = "https://discord.com/oauth2/authorize?client_id=240732567744151553&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds";

  return (
    <>
      <Link href={loginUrl}><a>Login</a></Link>
    </>
  );
}