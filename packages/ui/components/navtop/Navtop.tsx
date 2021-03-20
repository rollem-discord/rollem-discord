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
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}