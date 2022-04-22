import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

import { api } from "../services/apiClient";

type User = {
  email: string;
  id: string;
  name: string;
};

interface signInCredentials {
  email: string;
  password: string;
}

interface signUpCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthContextData {
  signIn: (data: signInCredentials) => Promise<void>;
  signOut: () => void;
  signUp: (data: signUpCredentials) => Promise<void>;
  user: User | undefined;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

let authChannel: BroadcastChannel;

export function signOut(sendMessage = true) {
  destroyCookie(undefined, "nextauth.token", { path: "/" });
  if (sendMessage) authChannel.postMessage("signOut");
  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut(false);
          break;
        case "signIn":
          Router.push("/empresas");
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      api
        .post("/getUserByToken", { token })
        .then(({ data }) => {
          const { email, id, name } = data;
          setUser({ email, id, name });
        })
        .catch(() => signOut());
    }
  }, []);

  async function signUp({ email, password, name }: signUpCredentials) {
    const { data } = await api.post("/signup", {
      email,
      password,
      name,
    });

    const { token, user } = data;
    setCookie(undefined, "nextauth.token", token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setUser({
      email: user.email,
      id: user.id,
      name: user.name,
    });

    if (authChannel) authChannel.postMessage("signIn");
    Router.push("/empresas");
  }

  async function signIn({ email, password }: signInCredentials) {
    const { data } = await api.post("/login", {
      email,
      password,
    });
    const { token, user } = data;
    setCookie(undefined, "nextauth.token", token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser({
      email,
      id: user.id,
      name: user.name,
    });
    if (authChannel) authChannel.postMessage("signIn");
    Router.push("/empresas");
  }

  const value = useMemo(
    () => ({ isAuthenticated, signIn, user, signOut, signUp }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
