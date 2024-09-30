import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import ActiveLink from '../ActiveLink';
import Link from 'next/link';
import { RollemSessionData } from '@rollem/ui/lib/api/old.withSession';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { Avatar, SvgIcon, Tooltip } from '@mui/material';
import { ExitToApp, Settings } from '@mui/icons-material';
import { AppContext } from '@rollem/ui/lib/contexts/request-context';
import { useContext } from 'react';

const API_URL = '/api/auth/discord/getData';

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

const useStyles = makeStyles((theme: Theme) =>
  ({
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
  const context = useContext(AppContext);
  const classes = useStyles();
  const { data, error } = useSWR<RollemSessionData>(API_URL, fetcher);
  

  if (data?.discord?.user) {
    const avatar = data?.discord?.user?.avatar;
    const userId = data?.discord?.user?.id;
    const username = data?.discord?.user?.username;
    const discriminator = data?.discord?.user?.discriminator;

    return <>
      <Tooltip title={`Account (${username}#${discriminator})`}>
        <span>
          <ActiveLink href={`/account`} className={classes.link} activeClassName={classes.activeLink}>
              <span className={classes.homeWrapper}>
                <Avatar
                  src={`https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`}
                  className={classes.profileImage}
                ></Avatar>
              </span>
          </ActiveLink>
        </span>
      </Tooltip>
      <Tooltip title="Settings">
        <span>
          <Link href={'/account/settings'}><SvgIcon component={Settings}></SvgIcon></Link>
        </span>
      </Tooltip>
      <Tooltip title="Logout">
        <span>
          <Link href={"/account/logout"} className={classes.link}>

            <SvgIcon component={ExitToApp}></SvgIcon>

          </Link>
        </span>
      </Tooltip>
    </>;
  }

  const callback = `${context.baseUrl}/api/auth/discord/callback`;
  const encodedCallback = encodeURIComponent(callback);
  const loginUrl = `https://discord.com/oauth2/authorize?client_id=240732567744151553&redirect_uri=${encodedCallback}&response_type=code&scope=identify%20guilds`;

  return <>
    <Link href={loginUrl}>Login</Link>
  </>;
}