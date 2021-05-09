import { ServerSideTemporaryRedirectPage, serverSideTemporaryRedirectServerSideProps } from '@rollem/ui/components/TemporaryRedirect';

// rollem-next invite link
const targetUrl = 'https://discordapp.com/oauth2/authorize?client_id=840409146738475028&scope=bot&permissions=68608';

export default ServerSideTemporaryRedirectPage(targetUrl, "Click here to invite Rollem Next to your server");

export const getServerSideProps = serverSideTemporaryRedirectServerSideProps(targetUrl);