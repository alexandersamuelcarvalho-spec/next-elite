import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const { createAccount, getAllAccounts } = await import('../../../../lib/sheets');
        const accounts = await getAllAccounts();
        const login = user.email || user.name;
        const existing = accounts.find(a => a.login === login);

        if (!existing) {
          await createAccount({
            name: user.name || login,
            phone: '',
            loginType: account.provider === 'google' ? 'G' : 'FB',
            login,
            status: 'user',
            teams: [],
          });
        }
        return true;
      } catch (err) {
        console.error('Error checking/creating account in Google Sheets:', err.message);
        return true;
      }
    },
    async session({ session, token }) {
      // Add user role to session
      try {
        const { getAllAccounts } = await import('../../../../lib/sheets');
        const accounts = await getAllAccounts();
        const account = accounts.find(a => a.login === session.user?.email);
        if (account) {
          session.user.accountName = account.accountName;
          session.user.status = account.status;
          session.user.teams = account.teams;
          session.user.phone = account.phoneNumber;
        }
      } catch (err) {
        console.error('Error loading account data:', err);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
