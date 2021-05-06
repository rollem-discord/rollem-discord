import RootLayout from "@rollem/ui/components/layouts/RootLayout";
import { Card, Grid, CardContent, CardHeader, makeStyles, createStyles, Theme, Avatar, Accordion, AccordionSummary, Typography, AccordionDetails, Tooltip, Link, Button, CardActions } from "@material-ui/core";
import fetch from 'isomorphic-unfetch';
import useSWR from "swr";
import { RollemSessionData } from "@rollem/ui/lib/withSession";
import { Cloud, ExpandMore, Web } from '@material-ui/icons';
import React from "react";

const API_URL = '/api/auth/discord/getData';

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export default function AccountAfterDelete() {
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
    <RootLayout>
      <Grid container justify="center" spacing={3} className={classes.gridWrapper}>
        <Grid item>
          <Card>
            <CardHeader title="Account Deleted" subheader="Who are you?"/>
            <CardContent>
              <h2>Your account has been deleted</h2>
              <h3>What was deleted immediately</h3>
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
          </Card>
        </Grid>
      </Grid>
    </RootLayout>
  )
}
