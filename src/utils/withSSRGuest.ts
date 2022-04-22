import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context, { path: "/" });
    const token = cookies["nextauth.token"];
    if (token) {
      return {
        redirect: {
          destination: "/empresas",
          permanent: false,
        },
      };
    }
    const result = await fn(context);
    return result;
  };
}
