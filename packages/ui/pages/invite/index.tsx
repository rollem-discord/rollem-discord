import { ServerSideTemporaryRedirectPage, serverSideTemporaryRedirectServerSideProps } from '@rollem/ui/components/TemporaryRedirect';

// rollem invite link
const targetUrl = 'https://discordapp.com/oauth2/authorize?client_id=240732567744151553&scope=bot&permissions=68608"';

export default ServerSideTemporaryRedirectPage(targetUrl, "Click here to invite Rollem to your server");

export const getServerSideProps = serverSideTemporaryRedirectServerSideProps(targetUrl);