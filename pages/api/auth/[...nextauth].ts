import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProviders from 'next-auth/providers/google';

const options: NextAuthOptions = {
    providers: [
        GoogleProviders({
            clientId: process.env.GOOGLE_OAUTH_CLIENTID ?? '',
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? '',
        })
    ],
    debug: false,
};

export default NextAuth(options);
