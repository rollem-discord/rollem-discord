import RootLayout from "@rollem/ui/components/layouts/RootLayout";
import { Card, Grid, CardContent, CardHeader, makeStyles, createStyles, Theme, Avatar, Accordion, AccordionSummary, Typography, AccordionDetails, Tooltip, CardActions, Button } from "@material-ui/core";
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
        "&:first-child": {
          paddingLeft: "0",
        },
      }
    }
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

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

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

        <Grid item>
          <Card>
            <CardHeader title="Account Information" subheader={
              <ul className={classes.index}>
                <li>Here's what we know about you.</li>
                <Tooltip title="Stored in your browser session."><li><Web className={classes.icon}/> browser session</li></Tooltip>
                <Tooltip title="Stored a database."><li><Cloud className={classes.icon}/> database</li></Tooltip>
              </ul>
            } />
            <CardContent>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className={classes.heading}>
                    <Tooltip title="Stored for browser session"><Web className={classes.icon} /></Tooltip>
                    Auth Object</Typography>
                  <Typography className={classes.secondaryHeading}>Authorization and Identity secrets</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <p>This information is stored in the browser and on the server in your session. It is not stored to a database.</p>
                  <p>This value is used to verify that you are indeed yourself, and perform actions against your account.</p>
                  <p>These values are secret and will allow any imposters the same access as rollem.rocks, so do not share them.</p>
                  <pre>
                    { JSON.stringify(data?.discord?.auth, null, 2) }
                  </pre>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className={classes.heading}>
                    <Tooltip title="Stored for browser session"><Web className={classes.icon} /></Tooltip>
                    Guilds
                  </Typography>
                  <Typography className={classes.secondaryHeading}>Guilds for listing on the Settings page</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <p>This information is stored in the browser and on the server in your session. It is not stored to a database.</p>
                  <p>This value is used to populate the settings list for the guilds you're in.</p>
                  <pre>
                    { JSON.stringify(data?.discord?.guilds, null, 2) }
                  </pre>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography className={classes.heading}>
                    <Tooltip title="Stored for browser session"><Web className={classes.icon} /></Tooltip>
                    User Information
                  </Typography>
                  <Typography className={classes.secondaryHeading}>Who you are</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <p>This information is stored in the browser and on the server in your session. It is not stored to a database.</p>
                  <p>This value is used to display your avatar and username, so you are sure you are on the right account.</p>
                  <pre>
                    { JSON.stringify(data?.discord?.user, null, 2) }
                  </pre>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography className={classes.heading}>
                    <Tooltip title="Stored in database"><Cloud className={classes.icon}/></Tooltip>
                    User Information
                  </Typography>
                  <Typography className={classes.secondaryHeading}>Your internal and discord ID, and some dates</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  <p>This information is stored on the database.</p>
                  <p>This is how we keep track of your user when interacting with Rollem</p>
                  <pre>
                    { JSON.stringify(data?.data?.user, null, 2) }
                  </pre>
                </AccordionDetails>
              </Accordion>
            </CardContent>
            <CardActions >
              <Button variant="contained" color="secondary" href={"/account/delete"}>
                I Want to Delete My Account
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </RootLayout>
  )
}
