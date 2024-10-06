import RootLayout from "@rollem/ui/components/layouts/RootLayout";
import {
  Card,
  Grid,
  CardContent,
  CardHeader,
  Theme,
  Avatar,
  Link,
  Button,
  CardActions,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import fetch from 'isomorphic-unfetch';
import useSWR from "swr";
import { RollemSessionData } from "@rollem/ui/lib/api/old.withSession";
import React from "react";

const API_URL = '/api/auth/discord/getData';

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}


const useStyles = makeStyles((theme: Theme) =>
  ({
    icon: {
      paddingRight: "0.25em",
    },
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
    gridWrapper: {
      marginTop: "2em",
      marginBottom: "2em",
    },
    cardContent: {
      textAlign: "center",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "center",
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    accordionDetails: {
      display: "block",
      "& pre": {
        maxHeight: "80vh",
        overflow: "auto",
        backgroundColor: theme.palette.getContrastText(theme.palette.grey[400]),
        color: theme.palette.grey[400],
      }
    },
    index: {
      listStyle: "none",
      margin: "0",
      padding: "0",
      display: "flex",
      flexFlow: "row",
      "& > li": {
        padding: "0.5em",
        display: "flex",
        flexFlow: "row nowrap",
        alignItems: "center",
      }
    }
  }),
);

export default function AccountDelete() {
  const classes = useStyles();
  const { data, error } = useSWR<RollemSessionData>(API_URL, fetcher);

  const avatar = data?.discord?.user?.avatar;
  const userId = data?.discord?.user?.id;
  const username = data?.discord?.user?.username;
  const discriminator = data?.discord?.user?.discriminator;
  const guildCount = data?.discord?.guilds?.length;

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    (<RootLayout>
      <Grid container justifyContent="center" spacing={3} className={classes.gridWrapper}>
        <Grid item>
          <Card>
            <CardHeader avatar={
              <Avatar src={`https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`} className={classes.profileImage}></Avatar>
            }
            title={
              <><span>{username}</span><span className={classes.discrimator}>#{discriminator}</span></>
            }
            subheader={`In ${guildCount} Guilds`}/>
            <CardContent className={classes.cardContent}>
              <p>You are now logged in.</p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card>
            <CardHeader title="Delete Account" subheader="Deletion is permanent so make sure you're certain."/>
            <CardContent>
              <h2>Delete Account</h2>
              <p>You may delete your account at any time.</p>
              <p>Make sure to get any information you want saved from the <Link href={"/account"}><a>Account Summary page</a></Link>, first.</p>

              <h3>What will be deleted immediately</h3>
              <ul>
                <li>Your Discord ID to Rollem ID table entry</li>
                <li>Any user settings</li>
                <li>Any user notes or variables</li>
              </ul>

              <h3>What will be deleted soon</h3>
              <ul>
                <li>Any mention of your IDs in the logs (7-30 days)</li>
              </ul>

              <h3>What won't be deleted</h3>
              <ul>
                <li>Channel/Guild Notes</li>
                <li>Channel/Guild Settings</li>
                <li>Channel/Guild Variables</li>
              </ul>
            </CardContent>
            <CardActions >
              <Button variant="contained" color="secondary" href={"/api/account/delete"}>
                Permanently Delete Account
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </RootLayout>)
  );
}
