import axios, { AxiosResponse } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';


type ctxType = GetServerSidePropsContext | undefined;

export function setupAPIClient(ctx: ctxType = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
  });

  api.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${cookies['nextauth.token']}`;

  const successEvent = (response: AxiosResponse) => response;
  const errorEvent = () => {
    if (typeof window !== 'undefined') signOut();
    return Promise.reject(new AuthTokenError());
  };

  api.interceptors.response.use(successEvent, errorEvent);

  return api;
}
