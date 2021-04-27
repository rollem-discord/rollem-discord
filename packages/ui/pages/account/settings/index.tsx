import RootLayout from "@rollem/ui/components/layouts/RootLayout";
import { Card, Grid, CardContent, CardHeader, makeStyles, createStyles, Theme, Avatar } from "@material-ui/core";
import fetch from 'isomorphic-unfetch';
import useSWR from "swr";
import { RollemSessionData } from "@rollem/ui/lib/withSession";

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
    gridWrapper: {
      marginTop: "2em",
      marginBottom: "2em",
    },
    cardContent: {
      textAlign: "center",
    },
  }),
);

export default function AccountSummary() {
  const classes = useStyles();
  const { data, error } = useSWR<RollemSessionData>(API_URL, fetcher);

  const avatar = data?.discord?.user?.avatar;
  const userId = data?.discord?.user?.id;
  const username = data?.discord?.user?.username;
  const discriminator = data?.discord?.user?.discriminator;
  const guildCount = data?.discord?.guilds?.length;

  return (
    <RootLayout>
      <Grid container justify="center" spacing={3} className={classes.gridWrapper}>
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
      </Grid>
    </RootLayout>
  )
}
