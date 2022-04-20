import { GetServerSidePropsContext } from "next";
import { setCookie, parseCookies, destroyCookie } from "nookies";

export const setCompany = (company_id: string) => {
  setCookie(null, "company_id", company_id, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
};

export const getCompanyId = (context: GetServerSidePropsContext) => {
  const cookies = parseCookies(context, { path: "/" });
  const { company_id } = cookies;
  if (!company_id) {
    throw new Error("No company found!");
  }

  return company_id;
};

export const removeCompanyCookies = (context: GetServerSidePropsContext) => {
  destroyCookie(context, "company_id", {
    path: "/",
  });
};
