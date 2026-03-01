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
      // After sign in, check if account exists in Google Sheet, if not create it
      try {
        const { createAccount, getAllAccounts } = await import('../../../../lib/sheets');
        const accounts = await getAllAccounts();
        const accountName = user.email?.substring(0, 8) || user.name?.substring(0, 8) || 'unknown';
        const existing = accounts.find(a => a.login === user.email || a.login === user.name);
        
        if (!existing) {
          await createAccount({
            name: accountName,
            phone: '',
            loginType: account.provider === 'google' ? 'G' : 'FB',
            login: user.email || user.name,
            status: 'user',
          });
        }
        return true;
      } catch (err) {
        console.error('Error checking/creating account:', err);
        return true; // Still allow sign in even if sheet fails
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
