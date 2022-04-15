import Router from 'next/router';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { api } from '../services/apiClient';

type User = {
  email: string;
  id: string;
};

interface signInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (data: signInCredentials) => Promise<void>;
  signOut: () => void;
  user: User | undefined;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

let authChannel: BroadcastChannel;

export function signOut(sendMessage = true) {
  destroyCookie(undefined, 'nextauth.token');
  if (sendMessage) authChannel.postMessage('signOut');
  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut(false);
          break;
        case 'signIn':
          Router.push('/empresas');
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();
    if (token) {
      api
        .get('/me')
        .then(({ data }) => {
          const { email, id } = data;
          setUser({ email, id });
        })
        .catch(() => signOut());
    }
  }, []);

  async function signIn({ email, password }: signInCredentials) {
    try {
      const { data } = await api.post('/users/login', {
        email,
        password,
      });
      const { token, id } = data;
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({
        email,
        id,
      });
      if (authChannel) authChannel.postMessage('signIn');
      Router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
