import jwtDecode from 'jwt-decode';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

type withSSRAuthOptions = {
  permissions: string[];
  roles: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: withSSRAuthOptions
) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);
    const token = cookies['nextauth.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      return await fn(context);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(context, 'nextauth.token');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
      return Promise.reject(err);
    }
  };
}
